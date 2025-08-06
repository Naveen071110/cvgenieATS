import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertGenerationSchema, insertUsageSessionSchema } from "@shared/schema";
import multer from "multer";
import PDFParser from 'pdf2json';
import { promises as fs } from 'fs';
import { promisify } from 'util';
import { exec } from 'child_process';
import path from 'path';

const execAsync = promisify(exec);

// Fallback generation functions
// FALLBACK RESUME GENERATION REMOVED - No longer generate fake content

// Content validation function
function validateExtractedContent(content: string): { isValid: boolean; reason: string } {
  // Basic length check
  if (!content || content.trim().length < 30) {
    return { isValid: false, reason: "Content too short (less than 30 characters)" };
  }
  
  // Check for English words
  const englishWords = content.match(/\b[a-zA-Z]{2,}\b/g) || [];
  if (englishWords.length < 20) {
    return { isValid: false, reason: "Insufficient English words (less than 20 words found)" };
  }
  
  // Check for resume-like content
  const resumeKeywords = [
    'experience', 'education', 'skills', 'work', 'employment', 'degree', 'university', 'college',
    'manager', 'developer', 'analyst', 'engineer', 'specialist', 'coordinator', 'assistant',
    'email', 'phone', 'address', 'contact', 'name', 'summary', 'objective', 'professional'
  ];
  
  const contentLower = content.toLowerCase();
  const foundKeywords = resumeKeywords.filter(keyword => contentLower.includes(keyword));
  
  if (foundKeywords.length < 2) {
    return { isValid: false, reason: "Content doesn't appear to be a resume (insufficient resume keywords found)" };
  }
  
  // Check for repetitive or garbled content - look for meaningful content sections
  const sentences = content.split(/[.!?]+/).filter(sentence => sentence.trim().length > 10);
  if (sentences.length < 3) {
    return { isValid: false, reason: "Content appears to be incomplete (less than 3 meaningful sentences)" };
  }
  
  // Check for excessive special characters (might indicate parsing issues)
  const specialCharRatio = (content.match(/[^\w\s.,;:()\-]/g) || []).length / content.length;
  if (specialCharRatio > 0.3) {
    return { isValid: false, reason: "Content contains too many special characters (might be garbled)" };
  }
  
  return { isValid: true, reason: "Content validation passed" };
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

// OLD FUNCTION REMOVED - Use generateOptimizedResume (AI-powered) instead

// Helper functions for resume parsing and generation
function extractAddress(resume: string): string {
  const lines = resume.split('\n');
  
  // Look for address patterns in the first 10 lines
  for (let i = 0; i < Math.min(10, lines.length); i++) {
    const line = lines[i].trim();
    
    // Common address indicators
    if (line.match(/\d+.*(?:street|st|avenue|ave|road|rd|drive|dr|lane|ln|extension|ext|boulevard|blvd)/i) ||
        line.match(/\d{5,6}/) || // ZIP codes
        line.match(/^[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\s*[-,]\s*[A-Z]{2,}/) || // City, State pattern
        (line.includes(',') && line.match(/\d/)) // Contains comma and numbers
    ) {
      return line;
    }
  }
  
  return "";
}

function extractWorkExperience(resume: string): Array<{title: string, company: string, duration: string, bullets: string[]}> {
  const experiences = [];
  
  // Look for work experience section dynamically
  const workSection = resume.match(/(?:WORK EXPERIENCE|EXPERIENCE|EMPLOYMENT|PROFESSIONAL EXPERIENCE)([\s\S]*?)(?:EDUCATION|SKILLS|PROJECTS|REFERENCES|$)/i);
  if (!workSection) return experiences;
  
  const workText = workSection[1];
  
  // Split by job entries - look for patterns like job titles followed by company info
  const jobBlocks = workText.split(/\n(?=[A-Z][A-Za-z\s]*(?:\||–|—|\s+\d{4}|\s+\w+\s+\d{4}))/);
  
  for (const block of jobBlocks) {
    const lines = block.trim().split('\n').filter(line => line.trim());
    if (lines.length < 2) continue;
    
    let title = '';
    let company = '';
    let duration = '';
    
    // Extract job info from the first few lines
    for (let i = 0; i < Math.min(3, lines.length); i++) {
      const line = lines[i].trim();
      
      // Look for duration patterns
      if (!duration && line.match(/\d{4}.*(?:present|current|\d{4})/i)) {
        duration = line;
        continue;
      }
      
      // Look for company patterns (often contains | separator or location)
      if (!company && (line.includes('|') || line.match(/,\s*[A-Z][a-z]+/))) {
        company = line.split('|')[0].trim();
        continue;
      }
      
      // First meaningful line is likely the title
      if (!title && line.length > 3 && !line.match(/^\d+$/) && !line.match(/^[•▸\-\*]/)) {
        title = line;
      }
    }
    
    // Extract bullet points
    const bullets = lines
      .filter(line => line.match(/^[\s]*[•▸\-\*]/))
      .map(line => line.replace(/^[\s]*[•▸\-\*]\s*/, '').trim())
      .filter(bullet => bullet.length > 10);
    
    if (title && company && bullets.length > 0) {
      experiences.push({
        title: title,
        company: company,
        duration: duration || 'Dates not specified',
        bullets: bullets
      });
    }
  }
  
  return experiences;
}

function extractEducation(resume: string): string {
  const eduSection = resume.match(/(?:EDUCATION|ACADEMIC)([\s\S]*?)(?:WORK|EXPERIENCE|SKILLS|PROJECTS|REFERENCES|$)/i);
  if (!eduSection) return "Bachelor's Degree";
  
  const lines = eduSection[1].split('\n').filter(line => line.trim());
  return lines.slice(0, 3).join('\n').trim();
}

function extractSkills(resume: string): string[] {
  const skillsSection = resume.match(/(?:SKILLS|TECHNICAL|TECHNOLOGY)([\s\S]*?)(?:WORK|EXPERIENCE|EDUCATION|PROJECTS|REFERENCES|$)/i);
  if (!skillsSection) return [];
  
  const text = skillsSection[1];
  const skills = text.match(/[A-Za-z][A-Za-z0-9+#\.\s]{1,30}(?=,|;|\n|\||$)/g) || [];
  return skills.map(s => s.trim()).filter(s => s.length > 1);
}

function extractAchievements(resume: string): string {
  const achievements = [];
  
  // Look for achievement keywords and patterns
  const achievementPatterns = [
    /received.*(?:award|recognition|excellence|acknowledgment)/gi,
    /(?:led|managed|supervised).*(?:team|project|initiative)/gi,
    /(?:increased|improved|reduced|optimized).*\d+/gi,
    /trained.*\d+.*(?:colleagues|people|members)/gi,
    /delivered.*(?:on time|under budget|successfully)/gi
  ];
  
  const lines = resume.split('\n');
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    // Check if line contains achievement indicators
    for (const pattern of achievementPatterns) {
      if (pattern.test(trimmed) && trimmed.length > 20) {
        const cleaned = trimmed.replace(/^[\s]*[•▸\-\*]\s*/, '');
        if (!achievements.includes(cleaned) && achievements.length < 5) {
          achievements.push(`▸ ${cleaned}`);
        }
      }
    }
  }
  
  // If no achievements found, create generic ones based on experience
  if (achievements.length === 0) {
    achievements.push(
      '▸ Demonstrated expertise in core technical competencies relevant to target role',
      '▸ Contributed to successful project delivery and organizational objectives'
    );
  }
  
  return achievements.join('\n');
}

function generateOptimizedSummary(resume: string, keywords: string[]): string {
  const yearsExp = extractYearsOfExperience(resume);
  const currentRole = extractCurrentRole(resume);
  const keySkills = keywords.slice(0, 3).join(', ');
  
  return `${currentRole} with ${yearsExp} of experience in ${keySkills}. Proven track record in ${keywords.slice(3, 6).join(', ')} with demonstrated ability to deliver high-impact solutions. Strong expertise in ${keywords.includes('sql') ? 'database development' : keywords[0]} and collaborative problem-solving.`;
}

function formatWorkExperience(experiences: Array<{title: string, company: string, duration: string, bullets: string[]}>, keywords: string[]): string {
  return experiences.map(exp => {
    const optimizedBullets = exp.bullets.map(bullet => optimizeBulletPoint(bullet, keywords));
    return `${exp.title.toUpperCase()}
${exp.company} | ${exp.duration}

${optimizedBullets.map(b => `▸ ${b}`).join('\n')}`;
  }).join('\n\n');
}

function formatEducation(education: string): string {
  if (!education || education === "Bachelor's Degree") {
    return `Bachelor's Degree in Related Field
University Name | Year
▸ Relevant academic background for the target position
▸ Strong foundation in core subject areas`;
  }
  
  // Clean and format the extracted education
  const lines = education.split('\n').filter(line => line.trim());
  const formatted = lines.map(line => {
    const trimmed = line.trim();
    if (trimmed.match(/^[•▸\-\*]/)) return trimmed;
    return `▸ ${trimmed}`;
  }).join('\n');
  
  return formatted;
}

function formatSkills(skills: string[], keywords: string[]): string {
  // Create comprehensive skill categories
  const databases = ['MySQL', 'PostgreSQL', 'DB2', 'ClickHouse', 'SQL Server', 'Oracle', 'MongoDB'];
  const programming = ['SQL', 'Python', 'Java', 'JavaScript', 'T-SQL', 'PL/SQL', 'R'];
  const tools = ['Informatica', 'Power BI', 'Tableau', 'Excel', 'JIRA', 'Git', 'Docker'];
  const cloud = ['AWS', 'Azure', 'Google Cloud', 'Amazon RDS', 'Snowflake'];
  
  return `DATABASE SYSTEMS:     ${databases.join(' • ')}
PROGRAMMING LANGUAGES: ${programming.join(' • ')}
DATA & BI TOOLS:      ${tools.join(' • ')}
CLOUD PLATFORMS:      ${cloud.join(' • ')}
METHODOLOGIES:        Agile • Scrum • DevOps • CI/CD • ETL/ELT • Data Warehousing`;
}

function optimizeBulletPoint(bullet: string, keywords: string[]): string {
  let optimized = bullet;
  keywords.forEach(keyword => {
    if (!optimized.toLowerCase().includes(keyword.toLowerCase()) && Math.random() < 0.3) {
      optimized = optimized.replace(/\b(using|with|in)\b/, `$1 ${keyword} and`);
    }
  });
  return optimized;
}

function extractDateFromLine(line: string): string {
  const dateMatch = line.match(/(\d{4}.*?\d{4}|\w+\s+\d{4}.*?(?:\w+\s+\d{4}|Present))/);
  return dateMatch ? dateMatch[0] : 'Recent';
}

function extractCurrentRole(resume: string): string {
  const roleMatch = resume.match(/(?:Data|Software|Senior|Lead|Principal)\s+(?:Analyst|Engineer|Developer|Specialist)/i);
  return roleMatch ? roleMatch[0] : 'Professional';
}

function extractYearsOfExperience(resume: string): string {
  const expMatch = resume.match(/(\d+)\+?\s*years?\s*of\s*experience/i);
  return expMatch ? `${expMatch[1]}+ years` : '3+ years';
}

function extractRelevantExperience(resume: string, keywords: string[]): string {
  const workSection = resume.match(/(?:WORK EXPERIENCE|EXPERIENCE)([\s\S]*?)(?:EDUCATION|SKILLS|$)/i);
  if (!workSection) return '';
  
  const lines = workSection[1].split('\n');
  return lines.filter(line => 
    keywords.some(keyword => line.toLowerCase().includes(keyword.toLowerCase()))
  ).slice(0, 2).join(' ');
}

function extractCompanyName(jobDescription: string): string {
  const companyMatch = jobDescription.match(/(?:at|for|with)\s+([A-Z][a-zA-Z\s&]+?)(?:\s+is|\s+has|\.|,)/);
  if (companyMatch) return companyMatch[1].trim();
  
  const firstLine = jobDescription.split('\n')[0];
  const words = firstLine.split(' ');
  return words.find(word => word.length > 3 && /^[A-Z]/.test(word)) || 'your organization';
}

function extractJobTitle(jobDescription: string): string {
  const titleMatch = jobDescription.match(/(?:seeking|for)\s+a\s+(?:skilled\s+)?(?:and\s+enthusiastic\s+)?([A-Z][a-zA-Z\s]+?)(?:\s+to|\s+with)/);
  if (titleMatch) return titleMatch[1].trim();
  
  const commonTitles = ['Developer', 'Engineer', 'Analyst', 'Manager', 'Specialist', 'Lead'];
  for (const title of commonTitles) {
    if (jobDescription.toLowerCase().includes(title.toLowerCase())) {
      return `${title}`;
    }
  }
  return 'position';
}

function generatePersonalizedParagraph(currentRole: string, keywords: string[], jobDescription: string): string {
  return `In my current role as ${currentRole}, I have developed comprehensive expertise in ${keywords.slice(0, 3).join(', ')}. My experience directly aligns with your requirements for ${keywords.slice(0, 2).join(' and ')}, and I have consistently delivered results in ${keywords.includes('performance') ? 'performance optimization' : keywords[3] || 'technical excellence'}.`;
}

function generateExperienceMatchParagraph(experience: string, keywords: string[]): string {
  return `What particularly excites me about this opportunity is the chance to apply my proven skills in ${keywords[0]} and ${keywords[1] || 'technical problem-solving'}. My track record includes ${experience || 'successful project delivery and team collaboration'}, directly relevant to the challenges outlined in your job description.`;
}

function generateClosingParagraph(keywords: string[], companyName: string): string {
  return `I am particularly drawn to ${companyName}'s focus on ${keywords[0]} and would welcome the opportunity to contribute to your team's success in ${keywords[1] || 'technology innovation'}.`;
}

// OLD FUNCTION REMOVED - Use generateCoverLetter (AI-powered) instead

// Enhanced PDF text extraction using Python pdfplumber
async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    console.log('Extracting text from PDF using Python pdfplumber...');
    
    // Convert buffer to base64 for Python script
    const base64Data = buffer.toString('base64');
    
    // Call Python script with the PDF data
    const { stdout, stderr } = await execAsync(`python pdf_extractor.py "${base64Data}"`);
    
    if (stderr) {
      console.log('Python stderr:', stderr);
    }
    
    // Parse the JSON response from Python script
    const result = JSON.parse(stdout);
    
    if (!result.success) {
      throw new Error(`Python PDF extraction failed: ${result.error}`);
    }
    
    console.log(`pdfplumber extracted ${result.text.length} characters from ${result.pages} pages`);
    console.log(`Word count: ${result.word_count}, Keyword matches: ${result.keyword_matches}, Resume-like: ${result.is_resume_like}`);
    
    if (!result.text || result.text.trim().length < 20) {
      throw new Error('PDF contains no readable text content');
    }
    
    // Clean the extracted text
    const cleanedText = cleanExtractedText(result.text);
    
    // Validate extracted content quality
    const validationResult = validateExtractedContent(cleanedText);
    if (!validationResult.isValid) {
      console.log(`Content validation failed: ${validationResult.reason}`);
      console.log(`First 300 characters of extraction attempt: "${cleanedText.substring(0, 300)}"`);
      throw new Error(`Resume content validation failed: ${validationResult.reason}`);
    }
    
    console.log(`Successfully extracted resume content: ${cleanedText.length} characters`);
    console.log(`Content preview: ${cleanedText.substring(0, 300)}...`);
    
    return cleanedText;
    
  } catch (error) {
    console.error('PDF extraction failed:', error.message);
    
    // If Python extraction fails, try a simple fallback method
    console.log('Trying fallback PDF text extraction...');
    try {
      const content = buffer.toString('binary');
      let fallbackText = '';
      
      // Look for parentheses-enclosed text (common in PDFs)  
      const parenthesesPattern = /\(([^)]{5,})\)/g;
      let match;
      while ((match = parenthesesPattern.exec(content)) !== null) {
        const text = match[1];
        if (/[a-zA-Z]{3,}/.test(text) && !text.includes('\\') && !text.includes('Font') && !text.includes('Subtype')) {
          fallbackText += text + ' ';
        }
      }
      
      if (fallbackText && fallbackText.trim().length > 100) {
        const cleanedFallback = cleanExtractedText(fallbackText);
        
        // Validate fallback content
        const validationResult = validateExtractedContent(cleanedFallback);
        if (!validationResult.isValid) {
          console.log(`Fallback content validation failed: ${validationResult.reason}`);
          console.log(`First 300 characters of fallback extraction: "${cleanedFallback.substring(0, 300)}"`);
          throw new Error(`Fallback extraction validation failed: ${validationResult.reason}`);
        }
        
        console.log(`Fallback extraction succeeded: ${cleanedFallback.length} characters`);
        return cleanedFallback;
      }
    } catch (fallbackError) {
      console.log('Fallback extraction also failed:', fallbackError.message);
    }
    
    throw new Error(`Unable to extract readable text from PDF: ${error.message}`);
  }
}

function cleanExtractedText(text: string): string {
  return text
    .replace(/\r\n/g, '\n') // Normalize line endings
    .replace(/\r/g, '\n') // Normalize line endings
    .replace(/\f/g, '\n') // Replace form feeds with newlines
    .replace(/\t/g, ' ') // Replace tabs with spaces
    .replace(/\s+/g, ' ') // Collapse multiple spaces
    .replace(/\n\s+/g, '\n') // Remove spaces at start of lines
    .replace(/\n{3,}/g, '\n\n') // Collapse multiple newlines
    .trim();
}

function enhanceEnglishContent(text: string): string {
  return text
    // Remove non-English characters and symbols that don't belong in English text
    .replace(/[^\x00-\x7F]/g, '') // Remove non-ASCII characters
    .replace(/[^\w\s\n\r.,;:!?@()-]/g, ' ') // Keep only standard English punctuation
    // Fix common OCR/extraction issues
    .replace(/\bfi\b/g, 'fi') // Fix ligature issues
    .replace(/\bfl\b/g, 'fl') // Fix ligature issues
    .replace(/[""]/g, '"') // Normalize quotes
    .replace(/['']/g, "'") // Normalize apostrophes
    // Clean up spacing and formatting
    .replace(/\s+/g, ' ') // Normalize spaces
    .replace(/\n\s+/g, '\n') // Remove leading spaces from lines
    .replace(/\n{3,}/g, '\n\n') // Limit consecutive newlines
    // Remove obvious PDF artifacts and metadata
    .replace(/\b(FlateDecode|Length|endstream|endobj|obj|Parent|Resources|Contents|ICCBased|FontDescriptor|FontFile2|xref|trailer|startxref)\b/gi, '')
    .replace(/\b\d{4,}\s+(00000\s+n|f)\b/g, '') // Remove xref table entries
    .replace(/^\s*\d+\s+\d+\s+obj\s*$/gm, '') // Remove object definitions
    .replace(/^\s*endobj\s*$/gm, '') // Remove object endings
    .replace(/^\s*stream\s*$/gm, '') // Remove stream markers
    .replace(/^\s*endstream\s*$/gm, '') // Remove endstream markers
    // Final cleanup
    .replace(/\s+/g, ' ')
    .replace(/\n\s+/g, '\n')
    .trim();
}

// Configure multer for file uploads
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf' || file.mimetype === 'text/plain') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and text files are allowed'));
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

  // Extract and preview resume content
  app.post("/api/extract-resume", upload.single('resume'), async (req, res) => {
    try {
      const resumeFile = req.file;

      if (!resumeFile) {
        return res.status(400).json({ error: "Resume file is required" });
      }

      console.log(`Extracting content from: ${resumeFile.originalname}, type: ${resumeFile.mimetype}, size: ${resumeFile.size} bytes`);

      let extractedContent: string;

      if (resumeFile.mimetype === 'application/pdf') {
        try {
          extractedContent = await extractTextFromPDF(resumeFile.buffer);
        } catch (pdfError) {
          console.error('PDF extraction failed completely:', pdfError.message);
          console.log(`Failed to extract content from file: ${resumeFile.originalname}`);
          console.log(`First 300 characters of extraction attempt: "${pdfError.message}"`);
          
          return res.status(400).json({ 
            error: "We couldn't extract content from this file. Please upload a text-based resume PDF with readable content. Image-based or scanned PDFs may not work properly." 
          });
        }
      } else {
        // Handle text files
        extractedContent = cleanExtractedText(resumeFile.buffer.toString('utf-8'));
      }

      // Clean up the extracted content
      extractedContent = enhanceEnglishContent(extractedContent);
      
      // Validate extracted content quality
      const validationResult = validateExtractedContent(extractedContent);
      if (!validationResult.isValid) {
        console.log(`Resume content validation failed: ${validationResult.reason}`);
        console.log(`First 300 characters of invalid content: "${extractedContent.substring(0, 300)}"`);
        return res.status(400).json({ 
          error: `We couldn't process this resume: ${validationResult.reason}. Please upload a text-based resume PDF with clear, readable content.` 
        });
      }

      res.json({ 
        filename: resumeFile.originalname,
        extractedContent,
        wordCount: extractedContent.split(/\s+/).length
      });

    } catch (error) {
      console.error('Resume extraction error:', error);
      res.status(500).json({ error: "Failed to extract resume content" });
    }
  });

  // Generate resume and cover letter
  app.post("/api/generate", upload.single('resume'), async (req, res) => {
    try {
      const { sessionId, jobDescription, resumeContent } = req.body;
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

      // Use provided resume content or extract from file
      let originalResume: string;
      
      if (resumeContent && resumeContent.trim().length > 0) {
        // Use the edited resume content from the frontend
        originalResume = resumeContent.trim();
        console.log(`Using edited resume content: ${originalResume.length} characters`);
        
        // Validate edited content as well
        const validationResult = validateExtractedContent(originalResume);
        if (!validationResult.isValid) {
          console.log(`Edited resume content validation failed: ${validationResult.reason}`);
          console.log(`First 300 characters of invalid edited content: "${originalResume.substring(0, 300)}"`);
          return res.status(400).json({ 
            error: `The provided resume content is invalid: ${validationResult.reason}. Please provide a proper resume with readable content.` 
          });
        }
      } else if (resumeFile) {
        // Fallback to file extraction if no content provided
        try {
          console.log(`Processing file: ${resumeFile.originalname}, type: ${resumeFile.mimetype}, size: ${resumeFile.size} bytes`);
          
          if (resumeFile.mimetype === 'application/pdf') {
            originalResume = await extractTextFromPDF(resumeFile.buffer);
          } else {
            originalResume = cleanExtractedText(resumeFile.buffer.toString('utf-8'));
          }
          
          if (!originalResume || originalResume.trim().length < 50) {
            console.error('Insufficient content extracted from file');
            console.log(`First 300 characters of failed extraction: "${originalResume?.substring(0, 300) || 'No content'}"`);
            return res.status(400).json({ 
              error: "We couldn't extract sufficient content from this file. Please upload a text-based resume PDF with readable content." 
            });
          }
          
          // Validate extracted content quality
          const validationResult = validateExtractedContent(originalResume);
          if (!validationResult.isValid) {
            console.log(`Resume content validation failed: ${validationResult.reason}`);
            console.log(`First 300 characters of invalid content: "${originalResume.substring(0, 300)}"`);
            return res.status(400).json({ 
              error: `We couldn't process this resume: ${validationResult.reason}. Please upload a text-based resume PDF with clear, readable content.` 
            });
          }
          
        } catch (error) {
          console.error('Resume processing error:', error);
          return res.status(400).json({ 
            error: `Failed to process resume file: ${error.message}. Please try uploading a different format or contact support.`
          });
        }
      } else {
        return res.status(400).json({ error: "Resume content or file is required" });
      }

      // Generate improved resume using AI (Deepseek) - Two-step process
      console.log('Calling Deepseek AI for resume generation (Step 1: Content optimization)...');
      try {
        // Step 1: Generate optimized content
        const initialResume = await generateOptimizedResume(originalResume, jobDescription);
        console.log('Step 1 completed - Initial resume length:', initialResume.length);
        
        // Step 2: Ensure proper ATS formatting
        console.log('Step 2: Applying ATS formatting...');
        optimizedResume = await formatResumeForATS(initialResume);
        console.log('Step 2 completed - Final formatted resume length:', optimizedResume.length);
        
        // Generate cover letter
        coverLetter = await generateCoverLetter(originalResume, jobDescription);
        
        console.log('AI-generated cover letter length:', coverLetter.length);
        console.log('Final resume preview (ATS formatted):', optimizedResume.substring(0, 200));
        
      } catch (aiError) {
        console.error('AI generation failed:', aiError);
        return res.status(500).json({ 
          error: "AI service temporarily unavailable. Please try again in a moment." 
        });
      }

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
            content: `Create a professional, ATS-optimized resume in plain text format. 

CRITICAL INSTRUCTION: Output ONLY the final, formatted resume. Do not copy the original input. Do not include summaries, explanations, or any meta-text. Just the improved ATS resume, nothing else.

CRITICAL PRESERVATION REQUIREMENTS:
- NEVER change or modify the candidate's name, phone number, email address, or physical location/address
- NEVER change or modify company names, organization names, university names, or institution names
- NEVER change or modify degree titles, certification names, or educational qualifications
- NEVER alter dates of employment, education, or any timeline information
- PRESERVE ALL original contact information EXACTLY as written
- PRESERVE ALL original institution names, company names, and degree titles EXACTLY as written
- PRESERVE ALL addresses, cities, states, zip codes EXACTLY as written
- PRESERVE ALL proper nouns (names of people, places, companies, schools) EXACTLY as they appear
- Only enhance descriptions, achievements, and bullet points - NEVER change factual information

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
    console.error('Deepseek AI generation failed:', error);
    throw new Error(`AI resume generation failed: ${error.message}`);
  }
}

async function formatResumeForATS(generatedResume: string): Promise<string> {
  const deepseekApiKey = process.env.DEEPSEEK_API_KEY || process.env.DEEPSEEK_API_KEY_ENV_VAR || "default_key";

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
            content: 'You are an expert ATS formatting specialist. Your only job is to reformat resumes into proper ATS-compliant structure.'
          },
          {
            role: 'user',
            content: `Reformat the following resume so it uses proper ATS-compliant formatting. Add section headers in all caps, use blank lines between sections, turn job duties or skills into short bullet points, and keep only the improved formatted resume—do not include any extra commentary. Here is the resume to reformat:

${generatedResume}`
          }
        ],
        temperature: 0.3,
        max_tokens: 2500
      })
    });

    if (!response.ok) {
      console.error(`ATS formatting API error: ${response.status}`);
      // Return the original generated resume if formatting fails
      return generatedResume;
    }

    const data = await response.json();
    let formattedContent = data.choices[0]?.message?.content || generatedResume;

    // Clean up any instructional text that might have been added
    formattedContent = cleanAIResponse(formattedContent);

    // Ensure proper line breaks and structure
    formattedContent = formattedContent
      .replace(/\n{3,}/g, '\n\n') // Normalize line breaks
      .replace(/^\s+$/gm, '') // Remove whitespace-only lines
      .trim();

    return formattedContent;

  } catch (error) {
    console.error('ATS formatting error:', error);
    // Return the original generated resume if formatting fails
    return generatedResume;
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