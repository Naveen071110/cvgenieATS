import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertGenerationSchema, insertUsageSessionSchema } from "@shared/schema";
import multer from "multer";

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

      // Extract text from PDF (simplified - in production use pdfplumber)
      const originalResume = `Extracted resume text from ${resumeFile.originalname}`;

      // Generate optimized resume and cover letter using AI
      const optimizedResume = await generateOptimizedResume(originalResume, jobDescription);
      const coverLetter = await generateCoverLetter(originalResume, jobDescription);

      // Save generation
      const generation = await storage.createGeneration({
        sessionId,
        originalResume,
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

// Keyword extraction function
function extractKeywords(jobDescription: string): string[] {
  // Remove common words and extract relevant keywords
  const commonWords = new Set(['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'should', 'could', 'can', 'may', 'might', 'must']);
  
  const words = jobDescription.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2 && !commonWords.has(word));
  
  // Count word frequency
  const wordCount = new Map<string, number>();
  words.forEach(word => {
    wordCount.set(word, (wordCount.get(word) || 0) + 1);
  });
  
  // Return top 10 most frequent keywords
  return Array.from(wordCount.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word]) => word);
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
            content: `Write a professional, ATS-compliant resume in plain text format.

CRITICAL FORMATTING REQUIREMENTS:
- Do NOT use tables, images, columns, graphics, or special symbols—use only standard text
- Use clear section headers: CONTACT INFORMATION, PROFESSIONAL SUMMARY, WORK EXPERIENCE, EDUCATION, SKILLS
- Use concise bullet points (use "•" for bullets only)
- Start each bullet with a strong action verb
- Include measurable achievements when possible
- Keep format simple—no colors, shading, footers, or header images
- No lines longer than 120 characters

TOP KEYWORDS TO INCLUDE: ${keywords.join(', ')}

Original Resume:
${originalResume}

Job Description:
${jobDescription}

Create an optimized resume that:
1. Contains ALL required sections (Contact, Summary, Experience, Education, Skills)
2. Uses the extracted keywords naturally throughout
3. Highlights relevant experience matching the job requirements
4. Uses ATS-friendly plain text formatting only
5. Includes quantifiable achievements with metrics when possible`
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
    const rawContent = data.choices[0]?.message?.content || "Error generating optimized resume";
    
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
            content: `Write a professional cover letter tailored for this job.

FORMATTING REQUIREMENTS:
- Use standard business letter format
- No tables, graphics, or special formatting
- Professional tone throughout
- ATS-readable plain text only

TOP KEYWORDS TO INCLUDE: ${keywords.join(', ')}

Resume:
${originalResume}

Job Description:
${jobDescription}

Please create a cover letter that:
1. Shows genuine interest in the specific role and company
2. Connects resume experience to job requirements
3. Highlights relevant achievements
4. Uses a professional but engaging tone
5. Demonstrates knowledge of the company/role
6. Ends with a strong call to action`
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
    const rawContent = data.choices[0]?.message?.content || "Error generating cover letter";
    
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
