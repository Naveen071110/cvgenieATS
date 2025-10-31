import type { Express, Request } from "express";
import { storage } from "./storage";
import documentGenerator from "./documentGenerator";
import documentParser from "./documentParser";
import multer from "multer";
import path from "path";
import fs from "fs";
import { requireAuth, getAuth } from "@clerk/express";
import { insertResume, getResumesByUserId, getResumeById, deleteResume } from "./database/resumeQueries";
import { createCheckoutSession, verifyPaymentStatus, getSubscriptionStatus, cancelSubscription } from "./services/dodoPayments";
import { resetAllUsersToFree } from "./database/resetSubscriptions";

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = path.join(process.cwd(), "tmp");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
    },
  }),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /pdf|doc|docx|txt/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only PDF, DOC, DOCX, and TXT files are allowed"));
    }
  },
});

/**
 * Gemini API helper function with retry logic
 * Migrated from DeepSeek - handles all AI calls with exponential backoff
 * @param prompt - The text prompt to send to Gemini
 * @returns The generated text response
 * @throws Error if all retry attempts fail
 */
async function callGemini(prompt: string): Promise<string> {
  const key = process.env.GEMINI_API_KEY;

  if (!key) {
    throw new Error("GEMINI_API_KEY is not configured in environment variables");
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${key}`;
  const payload = {
    contents: [{
      role: "user",
      parts: [{ text: prompt }]
    }]
  };

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        if (res.status === 429 || res.status >= 500) {
          // Retry with exponential backoff for rate limits and server errors
          if (attempt < 2) {
            await new Promise(r => setTimeout(r, 1250 * (attempt + 1)));
            continue;
          }
        }
        throw new Error(`Gemini API error: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();
      const output = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

      if (output && output.length > 0) {
        return output;
      }

      // Empty response, retry if attempts remain
      if (attempt < 2) {
        await new Promise(r => setTimeout(r, 1250 * (attempt + 1)));
        continue;
      }

      throw new Error("Gemini returned empty response");
    } catch (err: any) {
      if (err.name === 'AbortError') {
        if (attempt < 2) {
          await new Promise(r => setTimeout(r, 1250 * (attempt + 1)));
          continue;
        }
        throw new Error("Gemini API request timeout after 3 attempts");
      }

      if (attempt === 2) {
        throw new Error(`Gemini API failed after 3 tries: ${err.message}`);
      }
    }
  }

  throw new Error("No valid response from Gemini after all retry attempts");
}

// Generate optimized resume using Gemini
async function generateOptimizedResume(resumeText: string, jobDescription: string): Promise<string> {
  const prompt = `You are an expert resume writer and ATS optimization specialist. Create a professional, ATS-compliant resume based on the provided information.

CRITICAL REQUIREMENTS:
- Output ONLY plain text, no markdown, no special formatting
- Use clear section headers: CONTACT INFORMATION, PROFESSIONAL SUMMARY, WORK EXPERIENCE, EDUCATION, SKILLS
- Match keywords from the job description naturally throughout the resume
- Use bullet points (•) for lists
- Start each bullet with a strong action verb
- Include measurable achievements where possible
- Keep the format simple and ATS-friendly (no tables, columns, or graphics)

USER'S CURRENT RESUME:
${resumeText}

JOB DESCRIPTION TO OPTIMIZE FOR:
${jobDescription}

Generate an optimized, ATS-compliant resume now:`;

  return await callGemini(prompt);
}

/**
 * Two-pass ATS strict formatting (Gemini-migrated)
 * CRITICAL: This is the second AI pass that ensures strict ATS compliance
 * Preserves all original logic from DeepSeek implementation
 * @param resumeText - The initially optimized resume text
 * @returns ATS-compliant formatted resume or original if formatting fails
 */
async function applyATSStrictFormat(resumeText: string): Promise<string> {
  const atsPrompt = `Take this resume and convert it to an ATS-compliant, plain text, non-markdown, strictly formatted resume.

CRITICAL FORMATTING RULES:
- Use ONLY plain text, no markdown symbols (**, *, #, etc.)
- Structure with clear section headers in ALL CAPS: CONTACT INFORMATION, PROFESSIONAL SUMMARY, WORK EXPERIENCE, EDUCATION, SKILLS
- Use simple bullet points (• or -)
- No tables, no columns, no special characters except standard punctuation
- Each section must be clearly separated
- Keep all content but ensure strict ATS compliance

RESUME TO REFORMAT:
${resumeText}

Output ONLY the plain text ATS-compliant resume, no explanation or decoration:`;

  try {
    const atsCompliantResume = await callGemini(atsPrompt);

    // Validate ATS format
    if (!atsCompliantResume || atsCompliantResume.length < 100) {
      console.warn("ATS reformat produced short/empty output, using original");
      return resumeText;
    }

    // Check for required sections
    const hasRequiredSections = /CONTACT|EXPERIENCE|EDUCATION|SKILLS/i.test(atsCompliantResume);
    if (!hasRequiredSections) {
      console.warn("ATS reformat missing key sections, using original");
      return resumeText;
    }

    return atsCompliantResume;
  } catch (error) {
    console.error("ATS reformat failed, using original resume:", error);
    return resumeText;
  }
}

// Generate cover letter using Gemini
async function generateCoverLetter(resumeText: string, jobDescription: string): Promise<string> {
  const prompt = `You are an expert cover letter writer. Create a professional, personalized cover letter based on the resume and job description provided.

REQUIREMENTS:
- Address the specific job requirements mentioned in the description
- Highlight relevant skills and experiences from the resume
- Use a professional, engaging tone
- Keep it concise (3-4 paragraphs)
- Make it ATS-friendly (plain text, no special formatting)
- Include a strong opening and closing

USER'S RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}

Generate a professional cover letter now:`;

  return await callGemini(prompt);
}

export function registerRoutes(app: Express) {
  // File upload endpoint
  app.post("/api/upload", upload.single("resume"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const filePath = req.file.path;
      const result = await documentParser.extractText(filePath, req.file.mimetype);

      // Clean up uploaded file
      fs.unlinkSync(filePath);

      const parsedText = result.content;

      res.json({
        success: true,
        text: parsedText,
        filename: req.file.originalname,
      });
    } catch (error: any) {
      console.error("Upload error:", error);
      res.status(500).json({ error: error.message || "Failed to process file" });
    }
  });

  // Generate resume and cover letter endpoint (Gemini-migrated)
  app.post("/api/generate", async (req, res) => {
    try {
      const { resumeText, jobDescription, format = "pdf" } = req.body;

      if (!resumeText || !jobDescription) {
        return res.status(400).json({
          error: "Resume text and job description are required"
        });
      }

      console.log("Starting Gemini-powered generation...");

      // Step 1: Generate optimized resume with Gemini
      let optimizedResume = await generateOptimizedResume(resumeText, jobDescription);
      console.log("Initial optimization complete");

      // Step 2: Apply strict ATS formatting (second Gemini pass)
      optimizedResume = await applyATSStrictFormat(optimizedResume);
      console.log("ATS formatting applied");

      // Step 3: Generate cover letter
      const coverLetter = await generateCoverLetter(resumeText, jobDescription);
      console.log("Cover letter generated");

      // Step 4: Generate documents
      const timestamp = Date.now();
      const baseFilename = `generated_${timestamp}`;
      const outputs = await documentGenerator.generateMultipleFormats(
        optimizedResume,
        coverLetter,
        baseFilename,
        [format]
      );

      const resumePath = outputs.resumeDOCX || '';
      const coverLetterPath = outputs.coverLetterDOCX || '';

      // Step 5: Save to in-memory storage
      const sessionId = `session_${timestamp}`;

      await storage.createGeneration({
        sessionId,
        originalResume: resumeText,
        jobDescription,
        optimizedResume,
        coverLetter,
      });

      // Step 6: Save to Neon Postgres if user is authenticated
      const auth = getAuth(req);
      if (auth?.userId) {
        try {
          await insertResume(
            auth.userId,
            optimizedResume,
            coverLetter,
            jobDescription
          );
          console.log("Resume saved to Neon database for user:", auth.userId);
        } catch (dbError: any) {
          console.error("Failed to save to Neon database:", dbError);
          // Don't fail the request if database save fails
        }
      }

      res.json({
        success: true,
        resume: optimizedResume,
        coverLetter: coverLetter,
        resumePath: `/api/download/${path.basename(resumePath)}`,
        coverLetterPath: `/api/download/${path.basename(coverLetterPath)}`,
      });
    } catch (error: any) {
      console.error("Generation error:", error);

      // User-friendly error message
      const errorMessage = error.message?.includes("Gemini") || error.message?.includes("API")
        ? "Sorry, our resume AI is temporarily unavailable. Please try again in a few minutes."
        : "Failed to generate documents. Please check your input and try again.";

      res.status(500).json({ error: errorMessage });
    }
  });

  // Download endpoint
  app.get("/api/download/:filename", (req, res) => {
    try {
      const filename = req.params.filename;
      const filepath = path.join(process.cwd(), "tmp", filename);

      if (!fs.existsSync(filepath)) {
        return res.status(404).json({ error: "File not found" });
      }

      res.download(filepath, filename, (err) => {
        if (err) {
          console.error("Download error:", err);
          res.status(500).json({ error: "Failed to download file" });
        }
      });
    } catch (error: any) {
      console.error("Download error:", error);
      res.status(500).json({ error: "Failed to download file" });
    }
  });

  // Get user's resumes
  app.get("/api/resumes", async (req, res) => {
    try {
      const sessionId = req.query.sessionId as string || "default_session";
      const generations = await storage.getGenerationsBySession(sessionId);

      res.json(generations);
    } catch (error: any) {
      console.error("Fetch resumes error:", error);
      res.status(500).json({ error: "Failed to fetch resumes" });
    }
  });

  // GET /api/resume-history - Fetch resume history from NEON POSTGRES ONLY (requires auth)
  app.get("/api/resume-history", requireAuth(), async (req, res) => {
    try {
      const auth = getAuth(req);
      const userId = auth?.userId;

      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      // FETCH FROM NEON POSTGRES EXTERNAL DATABASE ONLY
      const resumes = await getResumesByUserId(userId);

      res.json({ resumes });
    } catch (error: any) {
      console.error("Error fetching from Neon database:", error);
      res.status(500).json({ error: "Failed to fetch resumes from external database" });
    }
  });

  // GET /api/resume-history/:id - Fetch single resume by ID from NEON POSTGRES ONLY (requires auth)
  app.get("/api/resume-history/:id", requireAuth(), async (req, res) => {
    try {
      const auth = getAuth(req);
      const userId = auth?.userId;
      const resumeId = parseInt(req.params.id);

      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      if (isNaN(resumeId)) {
        return res.status(400).json({ error: "Invalid resume ID" });
      }

      const resume = await getResumeById(resumeId, userId);

      if (!resume) {
        return res.status(404).json({ error: "Resume not found" });
      }

      res.json({ resume });
    } catch (error: any) {
      console.error("Error fetching resume from Neon database:", error);
      res.status(500).json({ error: "Failed to fetch resume from external database" });
    }
  });

  // DELETE /api/resume-history/:id - Delete resume from NEON POSTGRES ONLY (requires auth)
  app.delete("/api/resume-history/:id", requireAuth(), async (req, res) => {
    try {
      const auth = getAuth(req);
      const userId = auth?.userId;
      const resumeId = parseInt(req.params.id);

      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      if (isNaN(resumeId)) {
        return res.status(400).json({ error: "Invalid resume ID" });
      }

      const deleted = await deleteResume(resumeId, userId);

      if (!deleted) {
        return res.status(404).json({ error: "Resume not found" });
      }

      res.json({ success: true });
    } catch (error: any) {
      console.error("Error deleting resume from Neon database:", error);
      res.status(500).json({ error: "Failed to delete resume from external database" });
    }
  });

  // POST /api/subscription/create-checkout - Create Dodo Payments checkout session (requires auth)
  app.post("/api/subscription/create-checkout", requireAuth(), async (req, res) => {
    try {
      const auth = getAuth(req);
      const userId = auth?.userId;

      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const userEmail = auth.sessionClaims?.email as string || '';
      const userName = auth.sessionClaims?.name as string || auth.sessionClaims?.firstName as string || 'User';

      if (!userEmail) {
        return res.status(400).json({ error: "User email not found" });
      }

      // Initialize user record as FREE before creating checkout (if they don't exist)
      const { updateUserSubscription, getUserSubscription } = await import("./database/subscriptionQueries");
      const existingSubscription = await getUserSubscription(userId);
      
      // Only initialize if user doesn't exist or is not already Pro
      if (!existingSubscription.dodoCustomerId) {
        await updateUserSubscription(userId, '', '', 'free');
      }

      const session = await createCheckoutSession(userEmail, userName);

      res.json({
        sessionId: session.sessionId,
        paymentLink: session.paymentLink,
      });
    } catch (error: any) {
      console.error("Error creating checkout session:", error);
      res.status(500).json({ error: "Failed to create checkout session" });
    }
  });

  // GET /api/subscription/status - Get user's subscription status (requires auth)
  app.get("/api/subscription/status", requireAuth(), async (req, res) => {
    try {
      const auth = getAuth(req);
      const userId = auth?.userId;

      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const { getUserSubscription } = await import("./database/subscriptionQueries");
      const subscription = await getUserSubscription(userId);

      res.json({
        isPro: subscription.isPro,
        subscriptionStatus: subscription.subscriptionStatus,
        dodoCustomerId: subscription.dodoCustomerId,
        dodoSubscriptionId: subscription.dodoSubscriptionId,
      });
    } catch (error: any) {
      console.error("Error fetching subscription status:", error);
      res.status(500).json({ error: "Failed to fetch subscription status" });
    }
  });

  // POST /api/subscription/verify-payment - Verify payment and activate subscription (requires auth)
  app.post("/api/subscription/verify-payment", requireAuth(), async (req, res) => {
    try {
      const auth = getAuth(req);
      const userId = auth?.userId;
      const { paymentId } = req.body;

      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      if (!paymentId) {
        return res.status(400).json({ error: "Payment ID is required" });
      }

      const paymentStatus = await verifyPaymentStatus(paymentId);

      res.json({
        status: paymentStatus.status,
        customerId: paymentStatus.customerId,
        subscriptionId: paymentStatus.subscriptionId,
      });
    } catch (error: any) {
      console.error("Error verifying payment:", error);
      res.status(500).json({ error: "Failed to verify payment" });
    }
  });

  // POST /api/subscription/cancel - Cancel user's subscription (requires auth)
  app.post("/api/subscription/cancel", requireAuth(), async (req, res) => {
    try {
      const auth = getAuth(req);
      const userId = auth?.userId;
      const { subscriptionId } = req.body;

      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      if (!subscriptionId) {
        return res.status(400).json({ error: "Subscription ID is required" });
      }

      const result = await cancelSubscription(subscriptionId);

      res.json({
        success: result.success,
        status: result.status,
      });
    } catch (error: any) {
      console.error("Error canceling subscription:", error);
      res.status(500).json({ error: "Failed to cancel subscription" });
    }
  });

  // POST /api/admin/reset-subscriptions - Reset all users to free tier (admin only)
  app.post("/api/admin/reset-subscriptions", requireAuth(), async (req, res) => {
    try {
      const auth = getAuth(req);
      const userId = auth?.userId;

      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      // TODO: Add admin check here if needed
      // For now, any authenticated user can run this (remove in production or add proper admin check)

      const result = await resetAllUsersToFree();

      res.json({
        success: true,
        message: "All users reset to free tier",
        ...result
      });
    } catch (error: any) {
      console.error("Error resetting subscriptions:", error);
      res.status(500).json({ error: "Failed to reset subscriptions" });
    }
  });
}