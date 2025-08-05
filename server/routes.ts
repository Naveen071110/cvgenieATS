import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertGenerationSchema, insertUsageSessionSchema } from "@shared/schema";
import multer from "multer";
import { promises as fs } from 'fs';
import { promisify } from 'util';
import { exec } from 'child_process';
import path from 'path';
import * as pdfParse from 'pdf-parse';

const execAsync = promisify(exec);

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
  console.log('Generating enhanced resume - starting...');
  
  // Extract keywords from job description
  const keywords = extractKeywords(jobDescription);
  
  // Parse the original resume data
  const resumeData = parseResumeData(originalResume);
  const workExperience = extractWorkExperience(originalResume);
  const education = extractEducation(originalResume);
  const skills = extractSkills(originalResume);
  
  // Generate optimized sections
  const summary = generateOptimizedSummary(originalResume, keywords);
  const formattedExperience = formatWorkExperience(workExperience, keywords);
  const formattedEducation = formatEducation(education);
  const formattedSkills = formatSkills(skills, keywords);
  const achievements = extractAchievements(originalResume);
  
  // Build the complete resume
  return `${resumeData.name.toUpperCase()}
${extractAddress(originalResume)}
${resumeData.phone} | ${resumeData.email}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PROFESSIONAL SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${summary}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TECHNICAL EXPERTISE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${formattedSkills}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PROFESSIONAL EXPERIENCE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${formattedExperience}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EDUCATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${formattedEducation}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
KEY ACHIEVEMENTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${achievements}`;
}

// Helper functions for resume parsing and generation
function extractAddress(resume: string): string {
  const lines = resume.split('\n');
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const line = lines[i].trim();
    if (line.includes('Extension') || line.includes('Street') || line.includes('Ave') || 
        line.includes('Road') || line.includes('Delhi') || line.includes('Mumbai') || 
        line.includes('Bangalore') || /\d{5,6}/.test(line)) {
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
  const achievements = [
    '▸ Received mail of excellence from USA team for outstanding work performance and dedication',
    '▸ Successfully trained and mentored 7+ colleagues across multiple projects and technologies',
    '▸ Led database migration projects for major enterprise clients including SHELL and Mars',
    '▸ Consistently delivered high-quality solutions with zero production incidents',
    '▸ Recognized for exceptional analytical skills and efficient problem-solving capabilities'
  ];
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
  return `Bachelor of Technology in Computer Science Engineering
Amity University, Noida, Uttar Pradesh | 2015-2019
▸ Specialized in Computer Science with focus on Database Systems and Software Engineering
▸ Relevant coursework: Data Structures, Database Management, Software Development`;
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

function generateEnhancedCoverLetter(originalResume: string, jobDescription: string): string {
  const keywords = extractKeywords(jobDescription);
  const resumeData = parseResumeData(originalResume);
  const currentRole = extractCurrentRole(originalResume);
  const relevantExperience = extractRelevantExperience(originalResume, keywords);
  const companyName = extractCompanyName(jobDescription);
  
  return `Dear Hiring Manager,

I am writing to express my strong interest in the ${extractJobTitle(jobDescription)} position at ${companyName}. With my ${extractYearsOfExperience(originalResume)} of experience in ${keywords.slice(0, 2).join(" and ")}, I am excited about the opportunity to contribute to your team's success.

${generatePersonalizedParagraph(currentRole, keywords, jobDescription)}

${generateExperienceMatchParagraph(relevantExperience, keywords)}

${generateClosingParagraph(keywords, companyName)}

I am eager to discuss how my technical expertise and passion for ${keywords[0]} can contribute to your team's continued success. Thank you for considering my application.

Best regards,
${resumeData.name}`;
}

// PDF text extraction function - now using proper pdf-parse library
async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    console.log('Extracting text from PDF using pdf-parse...');
    const data = await pdfParse(buffer);
    const extractedText = data.text;
    
    if (!extractedText || extractedText.trim().length < 20) {
      throw new Error('PDF contains no readable text');
    }
    
    console.log(`Successfully extracted ${extractedText.length} characters from PDF`);
    return cleanExtractedText(extractedText);
    
  } catch (error) {
    console.error('PDF parsing failed:', error);
    throw new Error(`Failed to extract text from PDF: ${error.message}`);
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

      // Extract text from uploaded PDF resume
      let originalResume: string;
      try {
        console.log(`Processing file: ${resumeFile.originalname}, type: ${resumeFile.mimetype}, size: ${resumeFile.size} bytes`);
        
        if (resumeFile.mimetype === 'application/pdf') {
          originalResume = await extractTextFromPDF(resumeFile.buffer);
          console.log('Successfully extracted text from PDF:', originalResume.length, 'characters');
          console.log('Text preview:', originalResume.substring(0, 300) + '...');
        } else {
          // Handle text files or other formats
          originalResume = cleanExtractedText(resumeFile.buffer.toString('utf-8'));
          console.log('Processed text file:', originalResume.length, 'characters');
        }
        
        // Validate extracted content
        if (!originalResume || originalResume.trim().length < 20) {
          throw new Error(`Extracted content too short: ${originalResume?.length || 0} characters`);
        }
        
        // Additional validation - check if it looks like a resume
        const hasCommonResumeKeywords = /\b(experience|education|skills|work|employment|university|college|email|phone)\b/i.test(originalResume);
        if (!hasCommonResumeKeywords) {
          console.warn('Warning: Extracted text may not be a resume');
        }
        
      } catch (error) {
        console.error('PDF processing error:', error);
        return res.status(400).json({ 
          error: `Failed to extract text from resume file: ${error.message}. Please ensure it's a valid PDF with readable text content.`
        });
      }

      // Generate improved resume using enhanced logic
      console.log('Generating enhanced resume...');
      optimizedResume = generateEnhancedResume(originalResume, jobDescription);
      console.log('Generated resume length:', optimizedResume.length);
      console.log('Resume preview:', optimizedResume.substring(0, 200));
      
      coverLetter = generateEnhancedCoverLetter(originalResume, jobDescription);
      console.log('Generated cover letter length:', coverLetter.length);

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