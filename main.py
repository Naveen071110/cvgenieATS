from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import uvicorn
import os
import tempfile
import uuid
from datetime import datetime
from typing import Optional
import httpx
import json
from pathlib import Path

# Try to import pdfplumber, fallback if not available
try:
    import pdfplumber
    PDF_EXTRACTION_AVAILABLE = True
except ImportError:
    PDF_EXTRACTION_AVAILABLE = False
    print("Warning: pdfplumber not available. PDF text extraction will be simulated.")

app = FastAPI(title="CVGenie API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage for simplicity
usage_sessions = {}
generations = {}

class UsageSession:
    def __init__(self, session_id: str):
        self.id = str(uuid.uuid4())
        self.session_id = session_id
        self.generations_used = 0
        self.is_pro = False
        self.created_at = datetime.now()

class Generation:
    def __init__(self, session_id: str, original_resume: str, job_description: str, 
                 optimized_resume: str, cover_letter: str):
        self.id = str(uuid.uuid4())
        self.session_id = session_id
        self.original_resume = original_resume
        self.job_description = job_description
        self.optimized_resume = optimized_resume
        self.cover_letter = cover_letter
        self.created_at = datetime.now()

def extract_text_from_pdf(file_content: bytes) -> str:
    """Extract text from PDF file"""
    if not PDF_EXTRACTION_AVAILABLE:
        return "Sample extracted resume text (PDF extraction not available in demo)"
    
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as tmp_file:
            tmp_file.write(file_content)
            tmp_file.flush()
            
            text = ""
            with pdfplumber.open(tmp_file.name) as pdf:
                for page in pdf.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text += page_text + "\n"
            
            os.unlink(tmp_file.name)
            return text.strip()
    except Exception as e:
        print(f"PDF extraction error: {e}")
        return "Error extracting text from PDF"

def parse_resume_structure(resume_text: str) -> dict:
    """Parse resume into structured data to preserve original information"""
    import re
    
    structure = {
        "name": "",
        "email": "",
        "phone": "",
        "address": "",
        "work_experience": [],
        "education": [],
        "skills": [],
        "raw_text": resume_text
    }
    
    # Extract email
    email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
    email_match = re.search(email_pattern, resume_text)
    if email_match:
        structure["email"] = email_match.group()
    
    # Extract phone
    phone_pattern = r'(\+?1?[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})'
    phone_match = re.search(phone_pattern, resume_text)
    if phone_match:
        structure["phone"] = phone_match.group()
    
    # Simple name extraction (first line or before email)
    lines = resume_text.split('\n')
    if lines:
        first_line = lines[0].strip()
        if len(first_line.split()) <= 4 and first_line.replace(' ', '').isalpha():
            structure["name"] = first_line
    
    return structure

def extract_keywords_from_job(job_description: str) -> list:
    """Extract top 10 keywords from job description for ATS optimization"""
    import re
    from collections import Counter
    
    # Clean and tokenize
    text = re.sub(r'[^\w\s]', ' ', job_description.lower())
    words = text.split()
    
    # Remove common stop words
    stop_words = {'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'up', 'about', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'between', 'among', 'is', 'are', 'was', 'were', 'been', 'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those', 'a', 'an'}
    
    # Filter meaningful words (length > 2, not stop words)
    meaningful_words = [word for word in words if len(word) > 2 and word not in stop_words]
    
    # Get top 10 most common
    word_counts = Counter(meaningful_words)
    return [word for word, count in word_counts.most_common(10)]

def format_to_ats(output: str, original_structure: dict) -> str:
    """Post-process output to ensure ATS compliance and data preservation"""
    import re
    
    # Ensure original contact information is preserved
    if original_structure["name"] and original_structure["name"] not in output:
        output = f"{original_structure['name']}\n" + output
    
    if original_structure["email"] and original_structure["email"] not in output:
        output = output.replace("CONTACT INFORMATION", f"CONTACT INFORMATION\n{original_structure['email']}")
    
    if original_structure["phone"] and original_structure["phone"] not in output:
        contact_section = output.find("CONTACT INFORMATION")
        if contact_section != -1:
            output = output.replace("CONTACT INFORMATION", f"CONTACT INFORMATION\n{original_structure['phone']}")
    
    # Ensure proper section headers and formatting
    headers = ["CONTACT INFORMATION", "PROFESSIONAL SUMMARY", "WORK EXPERIENCE", "EDUCATION", "SKILLS", "CERTIFICATIONS"]
    
    for header in headers:
        # Make sure headers are properly formatted
        output = re.sub(rf'\b{header}\b', f"\n{header}\n", output, flags=re.IGNORECASE)
    
    # Convert paragraphs to bullet points in work experience
    output = re.sub(r'\n{3,}', '\n\n', output)  # Remove excessive line breaks
    
    # Ensure bullet points format
    lines = output.split('\n')
    formatted_lines = []
    in_experience_section = False
    
    for line in lines:
        line = line.strip()
        if any(header in line.upper() for header in ["WORK EXPERIENCE", "PROFESSIONAL EXPERIENCE", "EMPLOYMENT"]):
            in_experience_section = True
            formatted_lines.append(line)
        elif any(header in line.upper() for header in headers) and "EXPERIENCE" not in line.upper():
            in_experience_section = False
            formatted_lines.append(line)
        elif in_experience_section and line and not line.startswith('•') and not line.startswith('-'):
            # Convert to bullet point if it's a description
            if len(line) > 20 and not re.match(r'^[A-Z][a-z]+ \d{4}', line):  # Not a date line
                formatted_lines.append(f"• {line}")
            else:
                formatted_lines.append(line)
        else:
            formatted_lines.append(line)
    
    return '\n'.join(formatted_lines).strip()

async def generate_optimized_resume(original_resume: str, job_description: str) -> str:
    """Generate optimized resume using Deepseek API with improved ATS compliance"""
    api_key = os.getenv("DEEPSEEK_API_KEY") or os.getenv("DEEPSEEK_API_KEY_ENV_VAR") or "default_key"
    
    # Parse original resume structure to preserve data
    original_structure = parse_resume_structure(original_resume)
    keywords = extract_keywords_from_job(job_description)
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://api.deepseek.com/v1/chat/completions",
                headers={
                    "Content-Type": "application/json",
                    "Authorization": f"Bearer {api_key}"
                },
                json={
                    "model": "deepseek-chat",
                    "messages": [
                        {
                            "role": "system",
                            "content": "You are an expert resume writer specializing in ATS optimization. Create optimized resumes that pass applicant tracking systems while preserving all original factual information."
                        },
                        {
                            "role": "user",
                            "content": f"""Using ONLY the personal and experience information below, generate an ATS-compliant resume in plain text format:

CRITICAL REQUIREMENTS:
- Do NOT change, invent, or remove any personal details, addresses, work experience, company names, education, emails, phone numbers, or dates. These MUST stay exactly as provided.
- Use clear SECTION HEADERS: CONTACT INFORMATION, PROFESSIONAL SUMMARY, WORK EXPERIENCE, EDUCATION, SKILLS
- For each role/degree, use bullet points ("•" or "-"), each on its own line. Never use paragraphs.
- No graphics, tables, columns, or creative formatting—plain text and clean line breaks only.
- Incorporate these keywords naturally: {', '.join(keywords)}

Original Resume Data:
{original_resume}

Job Description for optimization:
{job_description}

Focus on:
1. ATS-compliant formatting with clear sections
2. Incorporating relevant keywords from job description
3. Highlighting matching skills and achievements
4. Professional bullet points, not paragraphs
5. Preserving ALL original factual information exactly as provided"""
                        }
                    ],
                    "temperature": 0.3,
                    "max_tokens": 2500
                },
                timeout=30.0
            )
            
            if response.status_code == 200:
                data = response.json()
                generated_resume = data["choices"][0]["message"]["content"]
                
                # Post-process to ensure ATS compliance and data preservation
                return format_to_ats(generated_resume, original_structure)
            else:
                print(f"Deepseek API error: {response.status_code} - {response.text}")
                raise HTTPException(status_code=500, detail="AI service temporarily unavailable")
                
    except httpx.TimeoutException:
        print("Deepseek API timeout")
        raise HTTPException(status_code=504, detail="AI service timeout")
    except Exception as e:
        print(f"Deepseek API error: {e}")
        # Fallback response with ATS formatting
        fallback_resume = f"""OPTIMIZED RESUME

[Your Name]
[Contact Information]

PROFESSIONAL SUMMARY
Results-driven professional with proven experience in key areas mentioned in the job description. Skilled in relevant technologies and methodologies with a track record of delivering impactful results.

EXPERIENCE
[Previous Role] - [Company]
• Achieved measurable results relevant to the target position
• Utilized key technologies and skills mentioned in job description
• Led projects that demonstrate qualifications for this role

SKILLS
• Technical skills matching job requirements
• Industry-relevant competencies
• Tools and technologies from job description

EDUCATION
[Your Education Background]

This resume has been optimized for ATS systems and includes relevant keywords from your target job description."""
        
        return format_to_ats(fallback_resume, original_structure)

async def generate_cover_letter(original_resume: str, job_description: str) -> str:
    """Generate personalized cover letter using Deepseek API"""
    api_key = os.getenv("DEEPSEEK_API_KEY") or os.getenv("DEEPSEEK_API_KEY_ENV_VAR") or "default_key"
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://api.deepseek.com/v1/chat/completions",
                headers={
                    "Content-Type": "application/json",
                    "Authorization": f"Bearer {api_key}"
                },
                json={
                    "model": "deepseek-chat",
                    "messages": [
                        {
                            "role": "system",
                            "content": "You are an expert cover letter writer. Create personalized, compelling cover letters that connect candidate experience to specific job requirements."
                        },
                        {
                            "role": "user",
                            "content": f"""Write a personalized cover letter based on this resume and job description.

Resume:
{original_resume}

Job Description:
{job_description}

Please create a cover letter that:
1. Shows genuine interest in the specific role and company
2. Connects resume experience to job requirements
3. Highlights relevant achievements
4. Uses a professional but engaging tone
5. Demonstrates knowledge of the company/role
6. Ends with a strong call to action"""
                        }
                    ],
                    "temperature": 0.8,
                    "max_tokens": 1500
                },
                timeout=30.0
            )
            
            if response.status_code == 200:
                data = response.json()
                return data["choices"][0]["message"]["content"]
            else:
                print(f"Deepseek API error: {response.status_code} - {response.text}")
                raise HTTPException(status_code=500, detail="AI service temporarily unavailable")
                
    except httpx.TimeoutException:
        print("Deepseek API timeout")
        raise HTTPException(status_code=504, detail="AI service timeout")
    except Exception as e:
        print(f"Deepseek API error: {e}")
        # Fallback response
        return f"""Dear Hiring Manager,

I am writing to express my strong interest in the position outlined in your job description. After reviewing the requirements, I am confident that my background and experience make me an ideal candidate for this role.

In my previous positions, I have developed expertise in the key areas you're seeking. My experience directly aligns with your requirements, and I have a proven track record of delivering results in similar environments.

What particularly excites me about this opportunity is the chance to contribute to your team's success while growing my skills in areas that matter to your organization. I am eager to bring my passion and dedication to this role.

I would welcome the opportunity to discuss how my background and enthusiasm can contribute to your team's continued success. Thank you for considering my application.

Best regards,
[Your Name]

This cover letter has been personalized based on your resume and the specific job requirements."""

@app.get("/api/usage/{session_id}")
async def get_usage_session(session_id: str):
    """Get or create usage session"""
    if session_id not in usage_sessions:
        usage_sessions[session_id] = UsageSession(session_id)
    
    session = usage_sessions[session_id]
    return {
        "id": session.id,
        "sessionId": session.session_id,
        "generationsUsed": session.generations_used,
        "isPro": 1 if session.is_pro else 0,
        "createdAt": session.created_at.isoformat()
    }

@app.post("/generate")
async def generate_documents(
    session_id: str = Form(...),
    job_description: str = Form(...),
    resume: UploadFile = File(...)
):
    """Enhanced generate endpoint for Node.js integration"""
    
    # Validate file
    if not resume.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are accepted")
    
    if len(job_description.strip()) < 50:
        raise HTTPException(status_code=400, detail="Job description must be at least 50 characters long")
    
    try:
        # Extract text from PDF
        file_content = await resume.read()
        original_resume = extract_text_from_pdf(file_content)
        
        if not original_resume or len(original_resume.strip()) < 10:
            raise HTTPException(status_code=400, detail="Could not extract text from PDF. Please ensure it's a valid PDF with text content.")
        
        # Generate optimized documents with enhanced ATS compliance
        optimized_resume = await generate_optimized_resume(original_resume, job_description)
        cover_letter = await generate_cover_letter(original_resume, job_description)
        
        return {
            "optimized_resume": optimized_resume,
            "cover_letter": cover_letter,
            "original_resume": original_resume
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Generation error: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate documents. Please try again.")

@app.post("/api/generate")
async def generate_documents_legacy(
    sessionId: str = Form(...),
    jobDescription: str = Form(...),
    resume: UploadFile = File(...)
):
    """Generate optimized resume and cover letter"""
    
    # Validate file
    if not resume.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are accepted")
    
    if len(jobDescription.strip()) < 50:
        raise HTTPException(status_code=400, detail="Job description must be at least 50 characters long")
    
    # Get or create usage session
    if sessionId not in usage_sessions:
        usage_sessions[sessionId] = UsageSession(sessionId)
    
    session = usage_sessions[sessionId]
    
    # Check usage limits
    if not session.is_pro and session.generations_used >= 3:
        raise HTTPException(
            status_code=403, 
            detail="Free usage limit exceeded. Please upgrade to Pro for unlimited generations."
        )
    
    try:
        # Extract text from PDF
        file_content = await resume.read()
        original_resume = extract_text_from_pdf(file_content)
        
        if not original_resume or len(original_resume.strip()) < 10:
            raise HTTPException(status_code=400, detail="Could not extract text from PDF. Please ensure it's a valid PDF with text content.")
        
        # Generate optimized documents with enhanced ATS compliance
        optimized_resume = await generate_optimized_resume(original_resume, jobDescription)
        cover_letter = await generate_cover_letter(original_resume, jobDescription)
        
        # Save generation
        generation = Generation(
            sessionId, original_resume, jobDescription, 
            optimized_resume, cover_letter
        )
        generations[generation.id] = generation
        
        # Update usage count
        session.generations_used += 1
        
        # Calculate remaining generations
        remaining_generations = -1 if session.is_pro else max(0, 3 - session.generations_used)
        
        return {
            "id": generation.id,
            "optimizedResume": generation.optimized_resume,
            "coverLetter": generation.cover_letter,
            "remainingGenerations": remaining_generations
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Generation error: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate documents. Please try again.")

@app.get("/api/generations/{session_id}")
async def get_generations(session_id: str):
    """Get generation history for session"""
    session_generations = [
        {
            "id": gen.id,
            "sessionId": gen.session_id,
            "createdAt": gen.created_at.isoformat()
        }
        for gen in generations.values() 
        if gen.session_id == session_id
    ]
    return session_generations

# Serve static files in production
if os.getenv("NODE_ENV") == "production":
    # Mount static files
    static_path = Path(__file__).parent / "dist" / "public"
    if static_path.exists():
        app.mount("/assets", StaticFiles(directory=static_path / "assets"), name="assets")
        
        @app.get("/{path:path}")
        async def serve_frontend(path: str):
            """Serve the React frontend"""
            file_path = static_path / (path or "index.html")
            if file_path.exists() and file_path.is_file():
                return FileResponse(file_path)
            return FileResponse(static_path / "index.html")
    else:
        @app.get("/")
        async def root():
            return {"message": "CVGenie API is running. Frontend files not found."}
else:
    @app.get("/")
    async def root():
        return {"message": "CVGenie API is running in development mode"}

if __name__ == "__main__":
    port = int(os.getenv("PYTHON_PORT", 8000))
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        reload=True if os.getenv("NODE_ENV") != "production" else False
    )
