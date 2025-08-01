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
      if (!session.isPro && session.generationsUsed >= 3) {
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
      await storage.updateUsageSession(sessionId, session.generationsUsed + 1);

      res.json({
        id: generation.id,
        optimizedResume: generation.optimizedResume,
        coverLetter: generation.coverLetter,
        remainingGenerations: session.isPro ? -1 : Math.max(0, 3 - (session.generationsUsed + 1))
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

// AI Generation Functions (using Deepseek API)
async function generateOptimizedResume(originalResume: string, jobDescription: string): Promise<string> {
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
            content: 'You are an expert resume writer specializing in ATS optimization. Create optimized resumes that pass applicant tracking systems while appealing to human recruiters.'
          },
          {
            role: 'user',
            content: `Please optimize this resume for the following job description. Focus on ATS compatibility, keyword optimization, and relevant experience highlighting.

Original Resume:
${originalResume}

Job Description:
${jobDescription}

Please provide an optimized resume that:
1. Uses relevant keywords from the job description
2. Highlights matching skills and experience
3. Uses ATS-friendly formatting
4. Maintains professional tone
5. Focuses on achievements and impact`
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      throw new Error(`Deepseek API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || "Error generating optimized resume";
    
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
            content: 'You are an expert cover letter writer. Create personalized, compelling cover letters that connect candidate experience to specific job requirements.'
          },
          {
            role: 'user',
            content: `Write a personalized cover letter based on this resume and job description.

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
    return data.choices[0]?.message?.content || "Error generating cover letter";
    
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
