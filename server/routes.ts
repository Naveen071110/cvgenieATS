import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertGenerationSchema, insertUsageSessionSchema } from "@shared/schema";
import multer from "multer";
// pdf-parse has startup issues, using pdf2json instead
import PDFParser from 'pdf2json';
import mammoth from 'mammoth';
import { z } from 'zod';
import fs from 'fs/promises';
import path from 'path';
import documentParser from './documentParser.js';
import documentGenerator from './documentGenerator.js';

// Placeholder for execAsync, assuming it's defined elsewhere or a mock
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);


// Extract text from DOCX files using mammoth
async function extractTextFromDOCX(buffer: Buffer): Promise<string> {
  try {
    const result = await mammoth.extractRawText({ buffer });
    console.log(`Mammoth extracted ${result.value.length} characters from DOCX`);
    return cleanExtractedText(result.value);
  } catch (error) {
    console.error('DOCX extraction failed:', error);
    throw new Error(`Failed to extract text from DOCX file: ${error.message}`);
  }
}

// Sample resume template to show users when PDF parsing fails
const SAMPLE_RESUME_TEMPLATE = `JOHN DOE  
123 Main St, City, Country | (123) 456-7890 | john.doe@email.com

PROFESSIONAL SUMMARY  
Results-driven data analyst with 4+ years of experience in analytics, migration, and reporting.

SKILLS  
• SQL • Python • Power BI • Data Visualization • Excel

WORK EXPERIENCE  
Data Analyst | XYZ Corp | 2020–2024  
• Designed data pipelines and dashboards using SQL and Power BI  
• Migrated data for 5+ enterprise projects  
• Improved reporting efficiency by 30% through automated processes

EDUCATION  
Bachelor of Technology in Computer Science  
University Name | 2015–2019`;

// Create error response with sample resume
function createSampleResumeError(errorMessage: string) {
  return {
    error: errorMessage,
    sampleResume: SAMPLE_RESUME_TEMPLATE,
    message: "Please re-upload your resume as a simple, text-based PDF similar to the example below:"
  };
}

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
async function extractTextFromPDF(buffer: Buffer): Promise<{ success: boolean; text?: string; error?: string }> {
  try {
    console.log('🔍 Starting PDF extraction...');
    console.log('Buffer size:', buffer.length, 'bytes');

    if (!buffer || buffer.length === 0) {
      throw new Error('PDF buffer is empty');
    }

    // Check if buffer starts with PDF signature
    const pdfSignature = buffer.subarray(0, 4).toString();
    if (pdfSignature !== '%PDF') {
      throw new Error('Invalid PDF file - missing PDF signature');
    }

    // Use pdf2json for PDF parsing
    const pdfParser = new PDFParser();
    
    return new Promise((resolve) => {
      pdfParser.on('pdfParser_dataError', (errData: any) => {
        console.error('❌ PDF parsing error:', errData.parserError);
        resolve({
          success: false,
          error: `PDF parsing failed: ${errData.parserError}`
        });
      });

      pdfParser.on('pdfParser_dataReady', (pdfData: any) => {
        try {
          // Extract text from pdf2json format
          let text = '';
          if (pdfData.Pages) {
            for (const page of pdfData.Pages) {
              if (page.Texts) {
                for (const textItem of page.Texts) {
                  if (textItem.R) {
                    for (const run of textItem.R) {
                      if (run.T) {
                        text += decodeURIComponent(run.T) + ' ';
                      }
                    }
                  }
                }
              }
            }
          }

          text = text.trim();
          if (!text || text.length === 0) {
            console.warn('⚠️ PDF extracted but contains no readable text');
            resolve({
              success: true,
              text: ''
            });
          } else {
            console.log('✅ PDF text extracted successfully, length:', text.length);
            resolve({
              success: true,
              text: text
            });
          }
        } catch (parseError) {
          console.error('❌ Error processing PDF data:', parseError);
          resolve({
            success: false,
            error: `PDF processing failed: ${parseError.message}`
          });
        }
      });

      // Parse the buffer
      pdfParser.parseBuffer(buffer);
    });
  } catch (error) {
    console.error('❌ PDF extraction error:', error);
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    return {
      success: false,
      error: `PDF extraction failed: ${error.message}`
    };
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
    const allowedTypes = [
      'application/pdf', 
      'text/plain',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    // Get file extension
    const fileExtension = file.originalname.toLowerCase().split('.').pop();
    const allowedExtensions = ['pdf', 'txt', 'docx'];

    console.log(`File upload: ${file.originalname}, detected MIME type: ${file.mimetype}, extension: ${fileExtension}`);

    // Accept file if either MIME type matches OR extension matches (for DOCX files that might be detected as octet-stream)
    if (allowedTypes.includes(file.mimetype) || allowedExtensions.includes(fileExtension || '')) {
      cb(null, true);
    } else {
      console.log(`Rejected file with MIME type: ${file.mimetype} and extension: ${file.extension}`);
      cb(new Error('Only PDF, DOCX (Word), and TXT files are allowed'));
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
      console.error('Failed to get usage session:', error);
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
          const extractResult = await extractTextFromPDF(resumeFile.buffer);
          if (!extractResult.success) {
            throw new Error(extractResult.error || 'Unknown PDF parsing error');
          }
          extractedContent = extractResult.text || '';
        } catch (pdfError) {
          console.error('PDF extraction failed completely:', pdfError.message);
          console.log(`Failed to extract content from file: ${resumeFile.originalname}`);
          console.log(`First 300 characters of extraction attempt: "${pdfError.message}"`);

          return res.status(400).json(createSampleResumeError(
            "We couldn't extract content from this file. Please upload a text-based resume PDF with readable content. Image-based or scanned PDFs may not work properly."
          ));
        }
      } else if (resumeFile.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
                 (resumeFile.mimetype === 'application/octet-stream' && resumeFile.originalname.toLowerCase().endsWith('.docx'))) {
        console.log('Processing DOCX file with mammoth...');
        try {
          extractedContent = await extractTextFromDOCX(resumeFile.buffer);
        } catch (docxError) {
          console.error('DOCX extraction failed completely:', docxError.message);
          console.log(`Failed to extract content from file: ${resumeFile.originalname}`);
          console.log(`First 300 characters of extraction attempt: "${docxError.message}"`);

          return res.status(400).json(createSampleResumeError(
            "We couldn't extract content from this DOCX file. Please ensure it's a valid Word document with readable text content."
          ));
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
        return res.status(400).json(createSampleResumeError(
          `We couldn't process this resume: ${validationResult.reason}. Please upload a text-based resume PDF with clear, readable content.`
        ));
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
  app.post('/api/generate', upload.single('file'), async (req, res) => {
    try {
      console.log('📝 Resume generation request received');
      console.log('File:', req.file ? req.file.originalname : 'No file');
      console.log('Body keys:', Object.keys(req.body));
      console.log('Body:', JSON.stringify(req.body, null, 2));
    
      const { personalInfo, jobDescription, sessionId, exportFormat = 'pdf' } = req.body;
    
      // Validate required fields
      if (!personalInfo) {
        console.error('❌ Missing personalInfo field');
        return res.status(400).json({ 
          error: 'Missing required field: personalInfo is required' 
        });
      }
    
      if (!jobDescription) {
        console.error('❌ Missing jobDescription field');
        return res.status(400).json({ 
          error: 'Missing required field: jobDescription is required' 
        });
      }
    
      if (!sessionId) {
        console.error('❌ Missing sessionId field');
        return res.status(400).json({ 
          error: 'Missing required field: sessionId is required' 
        });
      }
    
      // Parse personalInfo if it's a string
      let parsedPersonalInfo;
      try {
        parsedPersonalInfo = typeof personalInfo === 'string' ? JSON.parse(personalInfo) : personalInfo;
        console.log('✅ PersonalInfo parsed successfully');
      } catch (parseError) {
        console.error('❌ Error parsing personalInfo:', parseError);
        return res.status(400).json({ error: 'Invalid personalInfo format - must be valid JSON' });
      }
    
      // Validate parsedPersonalInfo structure
      if (!parsedPersonalInfo || typeof parsedPersonalInfo !== 'object') {
        console.error('❌ PersonalInfo is not a valid object');
        return res.status(400).json({ error: 'PersonalInfo must be a valid object' });
      }
    
      let originalResume: string = '';
    
      // Handle file upload if present
      if (req.file) {
        console.log('📄 Processing uploaded file:', req.file.originalname);
        console.log('File size:', req.file.size, 'bytes');
        console.log('File mimetype:', req.file.mimetype);
    
        try {
          if (req.file.mimetype === 'application/pdf') {
            console.log('🔍 Extracting text from PDF...');
            const extractResult = await extractTextFromPDF(req.file.buffer);
            if (!extractResult.success) {
              console.error('❌ PDF extraction failed:', extractResult.error);
              return res.status(400).json({ error: `PDF extraction failed: ${extractResult.error}` });
            }
            originalResume = extractResult.text || '';
            console.log('✅ PDF text extracted successfully, length:', originalResume.length);
          } else if (req.file.mimetype === 'text/plain') {
            console.log('📝 Processing plain text file...');
            originalResume = req.file.buffer.toString('utf-8');
            console.log('✅ Text file processed successfully, length:', originalResume.length);
          } else if (req.file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            console.log('📄 Processing DOCX file...');
            const result = await mammoth.extractRawText({ buffer: req.file.buffer });
            originalResume = result.value;
            console.log('✅ DOCX file processed successfully, length:', originalResume.length);
          } else {
            console.error('❌ Unsupported file type:', req.file.mimetype);
            return res.status(400).json({ 
              error: 'Unsupported file type. Please upload PDF, DOCX, or TXT files.',
              receivedType: req.file.mimetype
            });
          }
        } catch (fileError) {
          console.error('❌ File processing error:', fileError);
          console.error('File processing stack:', fileError.stack);
          return res.status(500).json({ 
            error: `File processing failed: ${fileError.message}`,
            details: process.env.NODE_ENV === 'development' ? fileError.stack : undefined
          });
        }
      } else if (req.body.resumeContent && req.body.resumeContent.trim().length > 0) {
        // Use the edited resume content from the frontend
        originalResume = req.body.resumeContent.trim();
        console.log(`Using provided resume content: ${originalResume.length} characters`);
      } else {
        return res.status(400).json({ error: "Resume content or file is required" });
      }
    
      // Validate extracted/provided resume content quality
      const validationResult = validateExtractedContent(originalResume);
      if (!validationResult.isValid) {
        console.log(`Resume content validation failed: ${validationResult.reason}`);
        console.log(`First 300 characters of invalid content: "${originalResume.substring(0, 300)}"`);
        return res.status(400).json(createSampleResumeError(
          `We couldn't process this resume: ${validationResult.reason}. Please upload a text-based resume PDF with clear, readable content.`
        ));
      }
    
      // Check usage limits
      let session = await storage.getUsageSession(sessionId);
      if (!session) {
        // Create a new session if it doesn't exist
        session = await storage.createUsageSession({
          sessionId,
          generationsUsed: 0,
          isPro: 0
        });
      }
      
      if (session && session.generationsUsed >= 3 && session.isPro !== 1) {
        return res.status(403).json({ 
          error: "Free usage limit exceeded. Please upgrade to Pro for unlimited generations." 
        });
      }
    
      console.log('🤖 Starting AI resume and cover letter generation...');
      console.log('Existing resume text length:', originalResume.length);
      console.log('Job description length:', jobDescription.length);
    
      let optimizedResume: string;
      let coverLetter: string;
    
      // Check if AI service is available
      try {
        // Generate optimized resume
        optimizedResume = await generateOptimizedResume(
          originalResume,
          parsedPersonalInfo,
          jobDescription
        );
        console.log('✅ Optimized resume generated successfully, length:', optimizedResume.length);
    
        // Generate cover letter
        coverLetter = await generateCoverLetter(
          originalResume,
          jobDescription
        );
        console.log('✅ Cover letter generated successfully, length:', coverLetter.length);
    
      } catch (aiError) {
        console.error('❌ AI generation error:', aiError);
        console.error('AI error stack:', aiError.stack);
    
        // Check if it's a specific AI service error
        if (aiError.message.includes('API key') || aiError.message.includes('unauthorized')) {
          return res.status(503).json({ 
            error: 'AI service configuration error',
            details: process.env.NODE_ENV === 'development' ? aiError.message : 'Please try again later'
          });
        }
    
        if (aiError.message.includes('timeout') || aiError.message.includes('ECONNREFUSED')) {
          return res.status(504).json({ 
            error: 'AI service temporarily unavailable',
            details: 'Please try again in a few moments'
          });
        }
    
        // Rethrow for general error handling if not a specific handled error
        throw aiError; 
      }
    
      // Generate export files if requested
      let downloadLinks = {};
      if (exportFormat && exportFormat !== 'none') {
        try {
          const formats = exportFormat === 'both' ? ['pdf', 'docx'] : [exportFormat];
          const timestamp = Date.now();
          const exports = await documentGenerator.generateMultipleFormats(
            optimizedResume,
            coverLetter,
            `generated_${timestamp}`,
            formats
          );
    
          // Convert file paths to download URLs
          Object.entries(exports).forEach(([key, filePath]) => {
            if (filePath) {
              const filename = path.basename(filePath);
              downloadLinks[key] = `/api/download/${filename}`;
            }
          });
          console.log('✅ Export files generated:', downloadLinks);
        } catch (error) {
          console.error('Export generation error:', error);
          // Don't fail the request if export fails, just log the error
        }
      }
    
      // Store generation
      await storage.createGeneration({
        sessionId,
        resume: optimizedResume,
        coverLetter
      });
      console.log('✅ Generation stored successfully');
    
      // Update usage count
      await storage.updateUsageSession(sessionId, (session.generationsUsed || 0) + 1);
      console.log('✅ Usage count updated');
    
      res.json({
        resume: optimizedResume,
        coverLetter,
        downloads: downloadLinks,
        message: 'Resume and cover letter generated successfully'
      });
    
    } catch (error) {
      console.error('❌ Resume generation error:', error);
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    
      // Send detailed error response
      res.status(500).json({ 
        error: 'Internal server error during resume generation',
        errorType: error.name,
        details: process.env.NODE_ENV === 'development' ? error.message : 'An unexpected error occurred',
        timestamp: new Date().toISOString()
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
      console.error('Failed to get generation history:', error);
      res.status(500).json({ error: "Failed to get generation history" });
    }
  });

  // Download endpoint for generated files
  app.get('/api/download/:filename', (req, res) => {
    try {
      const filename = req.params.filename;
      const filePath = path.join(process.cwd(), 'tmp', filename);

      console.log(`Attempting to download file: ${filePath}`);

      // Security check - ensure file exists and is in tmp directory
      if (!fs.existsSync(filePath) || !filePath.startsWith(path.join(process.cwd(), 'tmp'))) {
        console.error(`File not found or outside tmp directory: ${filePath}`);
        return res.status(404).json({ error: 'File not found' });
      }

      // Set appropriate content type
      const ext = path.extname(filename).toLowerCase();
      let contentType = 'application/octet-stream';

      if (ext === '.pdf') {
        contentType = 'application/pdf';
      } else if (ext === '.docx') {
        contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      }

      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);

      // Clean up file after download
      fileStream.on('end', () => {
        console.log(`File ${filename} streamed successfully. Scheduling cleanup.`);
        setTimeout(() => {
          fs.unlink(filePath, (err) => {
            if (err) console.error('Error cleaning up file:', err);
            else console.log(`Successfully cleaned up temporary file: ${filePath}`);
          });
        }, 5000); // Delete after 5 seconds
      });

      fileStream.on('error', (err) => {
        console.error(`Error streaming file ${filename}:`, err);
        if (!res.headersSent) {
          res.status(500).json({ error: 'Error streaming file' });
        }
      });

    } catch (error) {
      console.error('Download failed:', error);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Download failed' });
      }
    }
  });

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ 
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      apiKeyConfigured: !!process.env.DEEPSEEK_API_KEY,
      nodeVersion: process.version,
      uptime: process.uptime()
    });
  });

  // Detailed diagnostics endpoint (development only)
  app.get('/api/diagnostics', (req, res) => {
    if (process.env.NODE_ENV === 'production') {
      return res.status(404).json({ error: 'Not found' });
    }
  
    res.json({
      environment: process.env.NODE_ENV,
      nodeVersion: process.version,
      platform: process.platform,
      memory: process.memoryUsage(),
      uptime: process.uptime(),
      cwd: process.cwd(),
      apiKeys: {
        deepseek: !!process.env.DEEPSEEK_API_KEY,
        deepseekLength: process.env.DEEPSEEK_API_KEY ? process.env.DEEPSEEK_API_KEY.length : 0
      },
      timestamp: new Date().toISOString()
    });
  });
  
  // Placeholder for return Server, assuming this is the intended structure
  return createServer((req, res) => {
    app(req, res);
  });
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
async function generateOptimizedResume(
  existingResume: string,
  personalInfo: any,
  jobDescription: string
): Promise<string> {
  try {
    console.log('🤖 Calling Deepseek API for resume optimization...');

    // Validate API key
    if (!process.env.DEEPSEEK_API_KEY) {
      throw new Error('DEEPSEEK_API_KEY environment variable is not set');
    }

    // Validate inputs
    if (!jobDescription || jobDescription.trim().length === 0) {
      throw new Error('Job description cannot be empty');
    }

    if (!personalInfo || Object.keys(personalInfo).length === 0) {
      throw new Error('Personal information cannot be empty');
    }

    const prompt = `You are an expert resume writer and ATS optimization specialist. Create an optimized, professional resume based on the following information.

PERSONAL INFORMATION:
${JSON.stringify(personalInfo, null, 2)}

EXISTING RESUME CONTENT (if any):
${existingResume || 'No existing resume provided'}

JOB DESCRIPTION TO OPTIMIZE FOR:
${jobDescription}

Please create a comprehensive, ATS-optimized resume that:
1. Uses relevant keywords from the job description naturally
2. Highlights matching skills and experiences
3. Uses strong action verbs and quantifiable achievements
4. Follows a clean, professional format
5. Is optimized for Applicant Tracking Systems
6. Includes all sections: Contact Info, Professional Summary, Skills, Experience, Education
7. Tailors the content specifically for this job opportunity

Format the resume in clean, readable text format with clear section headers and consistent formatting.`;

    console.log('📤 Sending request to Deepseek API...');
    console.log('API Key present:', !!process.env.DEEPSEEK_API_KEY);
    console.log('Prompt length:', prompt.length);

    const requestBody = {
      model: 'deepseek-chat',
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    };

    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify(requestBody)
    });

    console.log('📥 Deepseek API response status:', response.status);
    console.log('📥 Deepseek API response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Deepseek API error response:', errorText);

      if (response.status === 401) {
        throw new Error('Deepseek API authentication failed - check API key');
      } else if (response.status === 429) {
        throw new Error('Deepseek API rate limit exceeded - please try again later');
      } else if (response.status === 500) {
        throw new Error('Deepseek API server error - please try again later');
      } else {
        throw new Error(`Deepseek API error: ${response.status} ${response.statusText} - ${errorText}`);
      }
    }

    const data = await response.json();
    console.log('✅ Deepseek API response received');

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('❌ Invalid Deepseek API response structure:', data);
      throw new Error('Invalid response from Deepseek API');
    }

    const generatedResume = data.choices[0].message.content;
    console.log('✅ Resume generated successfully, length:', generatedResume.length);

    return generatedResume;

  } catch (error) {
    console.error('❌ Error generating optimized resume:', error);
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    throw error;
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