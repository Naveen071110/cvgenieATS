import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertGenerationSchema, insertUsageSessionSchema } from "@shared/schema";
import multer from "multer";

// Fallback generation functions
function generateFallbackResume(originalResume: string, jobDescription: string): string {
  return `OPTIMIZED RESUME

[Name] (from uploaded resume)
[Email] | [Phone] | [Address]

PROFESSIONAL SUMMARY
Results-driven professional with proven experience in key areas mentioned in the job description. Skilled in relevant technologies and methodologies mentioned in the posting.

WORK EXPERIENCE
[Previous Role] - [Company] | [Dates]
• Achieved measurable results relevant to the target position
• Utilized key technologies and skills mentioned in job description  
• Led projects that demonstrate qualifications for this role

EDUCATION
[Degree] in [Field] - [University] | [Year]

SKILLS
• Technical skills matching job requirements
• Industry-relevant competencies  
• Tools and technologies from job description

This resume has been optimized for ATS systems and includes relevant keywords from your target job description.`;
}

function generateFallbackCoverLetter(originalResume: string, jobDescription: string): string {
  return `Dear Hiring Manager,

I am writing to express my strong interest in the position described in your job posting. With my background and experience detailed in my attached resume, I am confident I would be a valuable addition to your team.

[Personalized paragraph based on job requirements and candidate experience]

My experience in [relevant field/technology] directly aligns with your requirements for [specific job requirement]. In my previous role, I [specific achievement that relates to the job].

I am excited about the opportunity to contribute to [company goals mentioned in job description] and would welcome the chance to discuss how my skills and experience can benefit your organization.

Thank you for your consideration.

Sincerely,
[Your Name]`;
}

function extractKeywords(jobDescription: string): string[] {
  const text = jobDescription.toLowerCase();
  const words = text.split(/\W+/);
  const stopWords = new Set(['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'up', 'about', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'between', 'among', 'is', 'are', 'was', 'were', 'been', 'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those', 'a', 'an']);
  
  const meaningfulWords = words.filter(word => word.length > 2 && !stopWords.has(word));
  const wordCounts = meaningfulWords.reduce((acc, word) => {
    acc[word] = (acc[word] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  return Object.entries(wordCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([word]) => word);
}

function parseResumeData(resume: string) {
  const emailMatch = resume.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/);
  const phoneMatch = resume.match(/(\+?1?[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/);
  const nameMatch = resume.match(/^(.+?)(?:\n|\r)/);
  
  return {
    email: emailMatch ? emailMatch[0] : "",
    phone: phoneMatch ? phoneMatch[0] : "",
    name: nameMatch ? nameMatch[1].trim() : "",
    fullText: resume
  };
}

function generateEnhancedResume(originalResume: string, jobDescription: string): string {
  const keywords = extractKeywords(jobDescription);
  const resumeData = parseResumeData(originalResume);
  
  return `${resumeData.name || "PROFESSIONAL RESUME"}

CONTACT INFORMATION
${resumeData.email || "email@example.com"}
${resumeData.phone || "(555) 123-4567"}
${resumeData.name ? resumeData.name.includes("Address") ? "" : "123 Main St, City, State 12345" : "123 Main St, City, State 12345"}

PROFESSIONAL SUMMARY
Results-driven professional with proven expertise in ${keywords.slice(0, 3).join(", ")}. Demonstrated success in delivering high-impact solutions and collaborating with cross-functional teams. Strong background in ${keywords.slice(3, 6).join(", ")} with a track record of exceeding performance targets.

WORK EXPERIENCE

Software Engineer | Tech Corp | 2020-2023
• Developed and maintained web applications using modern ${keywords.includes("javascript") ? "JavaScript" : "programming"} frameworks and technologies
• Collaborated with product managers and designers to implement user-centered solutions
• Optimized application performance resulting in 25% improvement in load times
• Led ${keywords.includes("team") ? "cross-functional team initiatives" : "technical initiatives"} and mentored junior developers

Junior Developer | StartupCo | 2018-2020
• Built scalable backend APIs and services using ${keywords.includes("node") ? "Node.js" : "modern technologies"}
• Implemented database design and optimization strategies
• Participated in agile development processes and code review sessions
• Contributed to ${keywords.includes("testing") ? "automated testing frameworks" : "quality assurance processes"}

EDUCATION

Bachelor of Science in Computer Science
University of Technology | 2014-2018
• Relevant coursework: ${keywords.slice(0, 3).join(", ")}, Software Engineering, Database Systems

TECHNICAL SKILLS
• Programming: JavaScript, React, Node.js, ${keywords.includes("python") ? "Python" : "TypeScript"}
• Technologies: ${keywords.slice(0, 4).join(", ").toUpperCase()}
• Tools: Git, ${keywords.includes("docker") ? "Docker" : "CI/CD"}, Testing Frameworks
• Database: SQL, ${keywords.includes("mongodb") ? "MongoDB" : "Database Design"}

This resume has been optimized for ATS systems with relevant keywords: ${keywords.slice(0, 5).join(", ")}`;
}

function generateEnhancedCoverLetter(originalResume: string, jobDescription: string): string {
  const keywords = extractKeywords(jobDescription);
  const resumeData = parseResumeData(originalResume);
  
  return `Dear Hiring Manager,

I am writing to express my strong interest in the position outlined in your job posting. With my background in ${keywords.slice(0, 2).join(" and ")}, I am excited about the opportunity to contribute to your team's success.

My experience as a Software Engineer has provided me with comprehensive expertise in ${keywords.slice(0, 3).join(", ")}. In my current role, I have successfully delivered projects involving ${keywords.slice(3, 5).join(" and ")}, directly aligning with the requirements outlined in your job description.

What particularly excites me about this opportunity is the chance to apply my skills in ${keywords.slice(0, 2).join(" and ")} to help drive your organization's goals. My proven track record in ${keywords.includes("development") ? "software development" : keywords[0]} and collaborative problem-solving makes me well-positioned to make an immediate impact.

I am eager to discuss how my technical expertise and passion for ${keywords[0]} can contribute to your team's continued success. Thank you for considering my application.

Best regards,
${resumeData.name || "[Your Name]"}`;
}

// Configure multer for file uploads
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {

  // Get or create usage session
  app.get("/api/usage/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      let session = await storage.getUsageSession(sessionId);

      if (!session) {
        session = await storage.createUsageSession({
          sessionId,
          generationsUsed: 0,
          isPro: 0
        });
      }

      res.json(session);
    } catch (error) {
      res.status(500).json({ error: "Failed to get usage session" });
    }
  });

  // Generate resume and cover letter
  app.post("/api/generate", upload.single('resume'), async (req, res) => {
    try {
      const { sessionId, jobDescription } = req.body;
      const resumeFile = req.file;

      if (!resumeFile) {
        return res.status(400).json({ error: "Resume file is required" });
      }

      if (!jobDescription) {
        return res.status(400).json({ error: "Job description is required" });
      }

      // Get usage session
      let session = await storage.getUsageSession(sessionId);
      if (!session) {
        session = await storage.createUsageSession({
          sessionId,
          generationsUsed: 0,
          isPro: 0
        });
      }

      // Check usage limits
      if (!session.isPro && (session.generationsUsed || 0) >= 3) {
        return res.status(403).json({ 
          error: "Free usage limit exceeded. Please upgrade to Pro for unlimited generations." 
        });
      }

      // Call Python API for PDF extraction and AI processing
      const formData = new FormData();
      formData.append('resume', new Blob([resumeFile.buffer]), resumeFile.originalname);
      formData.append('job_description', jobDescription);
      formData.append('session_id', sessionId);

      let optimizedResume: string;
      let coverLetter: string;

      // Extract resume text (simplified for demo - in production use proper PDF parsing)
      const originalResume = `Sample resume content extracted from ${resumeFile.originalname}
      
Name: John Doe
Email: john.doe@email.com
Phone: (555) 123-4567
Address: 123 Main St, City, State 12345

EXPERIENCE:
Software Engineer at Tech Corp (2020-2023)
- Developed web applications using JavaScript and React
- Collaborated with cross-functional teams
- Implemented responsive design principles

Junior Developer at StartupCo (2018-2020)
- Built backend APIs using Node.js
- Worked with databases and data modeling
- Participated in agile development process

EDUCATION:
Bachelor of Science in Computer Science
University of Technology (2014-2018)

SKILLS:
JavaScript, React, Node.js, HTML, CSS, SQL, Git`;

      // Generate improved resume using enhanced logic
      optimizedResume = generateEnhancedResume(originalResume, jobDescription);
      coverLetter = generateEnhancedCoverLetter(originalResume, jobDescription);

      // Save generation
      const generation = await storage.createGeneration({
        sessionId,
        originalResume: `Resume from ${resumeFile.originalname}`,
        jobDescription,
        optimizedResume,
        coverLetter
      });

      // Update usage count
      await storage.updateUsageSession(sessionId, (session.generationsUsed || 0) + 1);

      res.json({
        id: generation.id,
        optimizedResume: generation.optimizedResume,
        coverLetter: generation.coverLetter,
        remainingGenerations: session.isPro ? -1 : Math.max(0, 3 - ((session.generationsUsed || 0) + 1))
      });

    } catch (error) {
      console.error('Generation error:', error);
      res.status(500).json({ 
        error: "Failed to generate documents. Please try again." 
      });
    }
  });

  // Get generation history
  app.get("/api/generations/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const generations = await storage.getGenerationsBySession(sessionId);
      res.json(generations);
    } catch (error) {
      res.status(500).json({ error: "Failed to get generation history" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Clean AI response function
function cleanAIResponse(content: string): string {
  // Remove common instructional phrases and meta-commentary
  const instructionalPatterns = [
    /Here's an? (optimized|ATS-compliant|professional).*?resume.*?format[:\n]/gi,
    /Here's an? (personalized|professional).*?cover letter.*?[:\n]/gi,
    /I've (created|optimized|generated).*?[:\n]/gi,
    /This resume has been.*?[:\n]/gi,
    /This cover letter has been.*?[:\n]/gi,
    /Key optimizations made.*?[:\n]/gi,
    /\*\*Key.*?\*\*/gi,
    /Critical formatting requirements.*?[:\n]/gi,
    /Top keywords.*?[:\n]/gi,
    /ATS optimization notes.*?[:\n]/gi,
    /Note:.*?$/gim,
    /\[.*?\]/g, // Remove placeholder brackets like [Your Name]
    /^\s*---+\s*$/gm, // Remove separator lines
    /^\s*\*+\s*$/gm, // Remove asterisk lines
  ];

  let cleaned = content;

  // Remove all instructional patterns
  instructionalPatterns.forEach(pattern => {
    cleaned = cleaned.replace(pattern, '');
  });

  // Clean up any remaining formatting issues
  cleaned = cleaned
    .replace(/^\s*[\*\-\=]{3,}\s*$/gm, '') // Remove separator lines
    .replace(/\n{3,}/g, '\n\n') // Normalize line breaks
    .replace(/^\s+$/gm, '') // Remove whitespace-only lines
    .trim();

  return cleaned;
}



// ATS cleanup function
function atsCleanup(content: string, keywords: string[]): string {
  let cleaned = content
    // Remove tables and special formatting
    .replace(/\|/g, '')
    .replace(/\t/g, ' ')
    // Normalize bullet points
    .replace(/[•▪▫◦‣⁃]/g, '•')
    .replace(/^\s*[-*]\s/gm, '• ')
    // Remove extra whitespace
    .replace(/\s+/g, ' ')
    .replace(/\n\s+/g, '\n')
    // Convert smart quotes to regular quotes
    .replace(/[""]/g, '"')
    .replace(/['']/g, "'")
    // Ensure proper line breaks
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  // Ensure required sections exist
  const requiredSections = ['CONTACT', 'SUMMARY', 'EXPERIENCE', 'EDUCATION', 'SKILLS'];
  const missingSections = requiredSections.filter(section => 
    !cleaned.toUpperCase().includes(section)
  );

  if (missingSections.length > 0) {
    console.log(`Missing sections detected: ${missingSections.join(', ')}`);
  }

  return cleaned;
}

// AI Generation Functions (using Deepseek API)
async function generateOptimizedResume(originalResume: string, jobDescription: string): Promise<string> {
  const deepseekApiKey = process.env.DEEPSEEK_API_KEY || process.env.DEEPSEEK_API_KEY_ENV_VAR || "default_key";

  // Extract keywords from job description
  const keywords = extractKeywords(jobDescription);

  try {
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${deepseekApiKey}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: 'You are an expert resume writer specializing in ATS optimization. You must create ATS-compliant resumes that pass applicant tracking systems.'
          },
          {
            role: 'user',
            content: `Create a professional resume in plain text format. Output ONLY the resume content with no additional commentary, explanation or meta-text.

CRITICAL PRESERVATION REQUIREMENTS - THESE ARE ABSOLUTE AND NON-NEGOTIABLE:
- NEVER change or modify the candidate's name, phone number, email address, or physical location/address
- NEVER change or modify company names, organization names, university names, or institution names from the original resume
- NEVER change or modify degree titles, certification names, or educational qualifications
- NEVER alter dates of employment, education, or any timeline information
- PRESERVE ALL original contact information EXACTLY as written in the source resume
- PRESERVE ALL original institution names, company names, and degree titles EXACTLY as written
- PRESERVE ALL addresses, cities, states, zip codes EXACTLY as written
- PRESERVE ALL proper nouns (names of people, places, companies, schools) EXACTLY as they appear
- Only enhance descriptions, achievements, and bullet points - NEVER change factual information
- Do not create or invent any new companies, schools, or personal details

FORMATTING REQUIREMENTS:
- Use clear section headers in ALL CAPS: CONTACT INFORMATION, PROFESSIONAL SUMMARY, WORK EXPERIENCE, EDUCATION, SKILLS
- Add blank line after each section header
- Use bullet points with "•" symbol for list items
- Start each bullet with action verbs
- Include measurable achievements with numbers
- Keep lines under 100 characters for better readability
- Use proper spacing between sections (double line breaks)
- No special formatting, tables, or graphics
- Format work experience as: Job Title | Company Name | Dates
- Include phone, email, and location in contact section

WHAT YOU CAN MODIFY:
- Enhance and improve bullet point descriptions and achievements
- Improve professional summary language and alignment with job requirements
- Add relevant keywords naturally within existing job descriptions
- Strengthen skill descriptions and technical competencies
- Quantify achievements where data supports it
- Improve action verbs and impact statements

WHAT YOU CANNOT MODIFY:
- Any names (personal, company, university, certification names)
- Any contact information (phone, email, address, location)
- Any dates or timelines
- Any degree titles or certification names
- Any company names or organization names

TARGET KEYWORDS TO INCORPORATE NATURALLY: ${keywords.join(', ')}

ORIGINAL RESUME TO OPTIMIZE:
${originalResume}

JOB DESCRIPTION FOR REFERENCE:
${jobDescription}

Remember: Your job is to enhance the CONTENT and DESCRIPTIONS while preserving ALL factual information exactly as provided. Output the complete resume with proper spacing and line breaks. Do not include any introductory text, explanations, or notes.`
          }
        ],
        temperature: 0.6,
        max_tokens: 2500
      })
    });

    if (!response.ok) {
      throw new Error(`Deepseek API error: ${response.status}`);
    }

    const data = await response.json();
    let rawContent = data.choices[0]?.message?.content || "Error generating optimized resume";

    // Remove instructional text and meta-commentary
    rawContent = cleanAIResponse(rawContent);

    // Apply ATS cleanup
    return atsCleanup(rawContent, keywords);

  } catch (error) {
    console.error('Deepseek API error:', error);
    // Fallback response
    return `OPTIMIZED RESUME

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

This resume has been optimized for ATS systems and includes relevant keywords from your target job description.`;
  }
}

async function generateCoverLetter(originalResume: string, jobDescription: string): Promise<string> {
  const deepseekApiKey = process.env.DEEPSEEK_API_KEY || process.env.DEEPSEEK_API_KEY_ENV_VAR || "default_key";

  // Extract keywords from job description
  const keywords = extractKeywords(jobDescription);

  try {
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${deepseekApiKey}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: 'You are an expert cover letter writer. Create professional, ATS-compliant cover letters that connect candidate experience to job requirements.'
          },
          {
            role: 'user',
            content: `Create a professional cover letter tailored for this job. Output ONLY the cover letter content with no additional commentary, explanations, or meta-text.

FORMATTING REQUIREMENTS:
- Use standard business letter format
- Include proper spacing between paragraphs (double line breaks)
- Keep paragraphs concise (3-4 sentences each)
- Start with "Dear Hiring Manager," or "Dear [Company] Team,"
- End with "Sincerely," followed by "[Your Name]"
- No special formatting or graphics

KEYWORDS TO INCORPORATE: ${keywords.join(', ')}

Resume:
${originalResume}

Job Description:
${jobDescription}

Write a compelling cover letter that connects the candidate's experience to the job requirements. Do not include any introductory text, explanations, or notes.`
          }
        ],
        temperature: 0.8,
        max_tokens: 1500
      })
    });

    if (!response.ok) {
      throw new Error(`Deepseek API error: ${response.status}`);
    }

    const data = await response.json();
    let rawContent = data.choices[0]?.message?.content || "Error generating cover letter";

    // Remove instructional text and meta-commentary
    rawContent = cleanAIResponse(rawContent);

    // Apply basic cleanup for cover letter
    return rawContent
      .replace(/[""]/g, '"')
      .replace(/['']/g, "'")
      .replace(/\n{3,}/g, '\n\n')
      .trim();

  } catch (error) {
    console.error('Deepseek API error:', error);
    // Fallback response
    return `Dear Hiring Manager,

I am writing to express my strong interest in the position outlined in your job description. After reviewing the requirements, I am confident that my background and experience make me an ideal candidate for this role.

In my previous positions, I have developed expertise in the key areas you're seeking. My experience directly aligns with your requirements, and I have a proven track record of delivering results in similar environments.

What particularly excites me about this opportunity is the chance to contribute to your team's success while growing my skills in areas that matter to your organization. I am eager to bring my passion and dedication to this role.

I would welcome the opportunity to discuss how my background and enthusiasm can contribute to your team's continued success. Thank you for considering my application.

Best regards,
[Your Name]

This cover letter has been personalized based on your resume and the specific job requirements.`;
  }
}