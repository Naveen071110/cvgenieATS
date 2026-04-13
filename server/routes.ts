import type { Express, Request } from "express";
import { storage } from "./storage";
import documentGenerator from "./documentGenerator";
import documentParser from "./documentParser";
import multer from "multer";
import path from "path";
import fs from "fs";
import { requireAuth, getAuth, clerkClient } from "@clerk/express";
import { insertResume, getResumesByUserId, getResumeById, deleteResume } from "./database/resumeQueries";
import { createCheckoutSession, verifyPaymentStatus, getSubscriptionStatus, cancelSubscription } from "./services/dodoPayments";
import { resetAllUsersToFree } from "./database/resetSubscriptions";
import type { ResumeData } from "./documentGenerator"; // Assuming ResumeData is exported from documentGenerator
import { getUserSubscription, updateUserSubscription } from "./database/subscriptionQueries";

const tmpDir = path.join(process.cwd(), "tmp");

// Ensure tmp directory exists
if (!fs.existsSync(tmpDir)) {
  fs.mkdirSync(tmpDir, { recursive: true });
}

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, tmpDir);
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
    const allowedExtensions = /\.(pdf|doc|docx|txt)$/i;
    const allowedMimeTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'application/octet-stream',
    ];
    const extname = allowedExtensions.test(path.extname(file.originalname));
    const mimetype = allowedMimeTypes.includes(file.mimetype) || allowedExtensions.test(file.originalname);

    if (extname || mimetype) {
      return cb(null, true);
    } else {
      cb(new Error("Only PDF, DOC, DOCX, and TXT files are allowed"));
    }
  },
});

async function getUserSubscriptionStatus(userId: string) {
  try {
    return await getUserSubscription(userId);
  } catch (error) {
    console.error("Error fetching user subscription status:", error);
    return { isPro: false, subscriptionStatus: 'free' };
  }
}

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
  // File upload endpoint (requires auth)
  app.post("/api/upload", upload.single("resume"), async (req, res) => {
    try {
      const userId = getAuth(req)?.userId;
      if (!userId) {
        return res.status(401).json({ error: "Please sign in to continue" });
      }

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

  // Extract resume endpoint - returns fields expected by the frontend generator
  app.post("/api/extract-resume", upload.single("resume"), async (req, res) => {
    try {
      const userId = getAuth(req)?.userId;
      if (!userId) {
        return res.status(401).json({ error: "Please sign in to continue" });
      }

      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const filePath = req.file.path;

      // Normalise mimetype — browsers sometimes send application/octet-stream
      // for DOCX files, so fall back to extension-based detection
      let mimetype = req.file.mimetype;
      const ext = path.extname(req.file.originalname).toLowerCase();
      if (mimetype === 'application/octet-stream') {
        if (ext === '.docx') mimetype = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        else if (ext === '.txt') mimetype = 'text/plain';
        else if (ext === '.pdf') mimetype = 'application/pdf';
      }

      const result = await documentParser.extractText(filePath, mimetype);

      // Clean up uploaded file
      try { fs.unlinkSync(filePath); } catch (_) { /* ignore cleanup errors */ }

      if (!result.isValid) {
        return res.status(422).json({
          error: "Could not extract readable text from this file. Please check the file is not empty or corrupted and try again."
        });
      }

      res.json({
        filename: req.file.originalname,
        extractedContent: result.content,
        wordCount: result.wordCount,
      });
    } catch (error: any) {
      console.error("Extract-resume error:", error);
      res.status(500).json({ error: error.message || "Failed to process file" });
    }
  });

  // Generate resume and cover letter endpoint (Gemini-migrated)
  app.post("/api/generate", async (req, res) => {
    try {
      const { resumeText, coverLetterText, jobDescription, format = "pdf" } = req.body;
      const userId = getAuth(req)?.userId; // Use getAuth directly

      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      if (!resumeText || !jobDescription) {
        return res.status(400).json({
          error: "Resume text and job description are required"
        });
      }

      console.log("Starting Gemini-powered generation...");

      // Step 1: Check user's Pro status for watermark and speed
      const userSubscription = await getUserSubscriptionStatus(userId);
      const isPro = userSubscription?.isPro || false;

      console.log('[Generate] User Pro status:', isPro ? 'Pro (no watermark, instant generation)' : 'Free (with watermark, delayed generation)');

      // Step 2: Generate optimized resume with Gemini
      let optimizedResume = await generateOptimizedResume(resumeText, jobDescription);
      console.log("Initial optimization complete");

      // Step 3: Apply strict ATS formatting (second Gemini pass)
      optimizedResume = await applyATSStrictFormat(optimizedResume);
      console.log("ATS formatting applied");

      // Step 4: Generate cover letter
      const coverLetter = await generateCoverLetter(resumeText, jobDescription);
      console.log("Cover letter generated");

      // Step 5: Generate documents
      const timestamp = Date.now();
      const baseFilename = `generated_${timestamp}`;
      
      // Assuming documentGenerator.generateMultipleFormats accepts isPro flag
      const outputs = await documentGenerator.generateMultipleFormats(
        optimizedResume,
        coverLetter,
        baseFilename,
        [format],
        isPro // Pass isPro flag here
      );

      const resumePath = outputs.resumeDOCX || '';
      const coverLetterPath = outputs.coverLetterDOCX || '';

      // Step 6: Save to Neon Postgres
      try {
        await insertResume(
          userId,
          optimizedResume,
          coverLetter,
          jobDescription
        );
        console.log("Resume saved to Neon database for user:", userId);
      } catch (dbError: any) {
        console.error("Failed to save to Neon database:", dbError);
        // Don't fail the request if database save fails
      }

      // Step 8: Apply generation speed difference
      // Free users: 4 second artificial delay for perceived value difference
      // Pro users: Instant results
      if (!isPro) {
        const FREE_USER_DELAY_MS = 4000; // 4 seconds
        console.log(`[Generate] Free user - applying ${FREE_USER_DELAY_MS}ms delay...`);
        await new Promise(resolve => setTimeout(resolve, FREE_USER_DELAY_MS));
        console.log('[Generate] Delay complete, sending response');
      } else {
        console.log('[Generate] Pro user - sending instant response');
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
      const filepath = path.join(tmpDir, filename); // Use tmpDir

      if (!fs.existsSync(filepath)) {
        return res.status(404).json({ error: "File not found" });
      }

      res.download(filepath, filename, (err) => {
        if (err) {
          console.error("Download error:", err);
          // Ensure error response is sent only once
          if (!res.headersSent) {
            res.status(500).json({ error: "Failed to download file" });
          }
        } else {
          // Optionally, clean up the file after download
          fs.unlink(filepath, (unlinkErr) => {
            if (unlinkErr) {
              console.error("Error deleting file after download:", unlinkErr);
            }
          });
        }
      });
    } catch (error: any) {
      console.error("Download endpoint error:", error);
      if (!res.headersSent) {
        res.status(500).json({ error: "Failed to download file" });
      }
    }
  });

  // Get user's resumes from storage
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

  // GET /api/resume-history - Fetch resume history from NEON POSTGRES ONLY (requires auth and active Pro)
  app.get("/api/resume-history", requireAuth(), async (req, res) => {
    try {
      const auth = getAuth(req);
      const userId = auth?.userId;

      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      // Check if user has active Pro subscription
      const subscription = await getUserSubscription(userId); // Use direct import

      const isPro = subscription.isPro && subscription.subscriptionStatus === 'active';

      if (!isPro) {
        return res.status(403).json({ 
          error: "Pro subscription required",
          message: "Resume History is a Pro feature. Upgrade to access your saved resumes."
        });
      }

      // FETCH FROM NEON POSTGRES EXTERNAL DATABASE ONLY
      const resumes = await getResumesByUserId(userId);

      res.json({ resumes });
    } catch (error: any) {
      console.error("Error fetching from Neon database:", error);
      res.status(500).json({ error: "Failed to fetch resumes from external database" });
    }
  });

  // GET /api/resume-history/:id - Fetch single resume by ID from NEON POSTGRES ONLY (requires auth and active Pro)
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

      // Check if user has active Pro subscription
      const subscription = await getUserSubscription(userId); // Use direct import

      const isPro = subscription.isPro && subscription.subscriptionStatus === 'active';

      if (!isPro) {
        return res.status(403).json({ 
          error: "Pro subscription required",
          message: "Resume History is a Pro feature. Upgrade to access your saved resumes."
        });
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

  // DELETE /api/resume-history/:id - Delete resume from NEON POSTGRES ONLY (requires auth and active Pro)
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

      // Check if user has active Pro subscription
      const subscription = await getUserSubscription(userId); // Use direct import

      const isPro = subscription.isPro && subscription.subscriptionStatus === 'active';

      if (!isPro) {
        return res.status(403).json({ 
          error: "Pro subscription required",
          message: "Resume History is a Pro feature. Upgrade to access your saved resumes."
        });
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

  // POST /api/subscription/create-checkout - Create Dodo Payments checkout link (requires auth)
  app.post("/api/subscription/create-checkout", requireAuth(), async (req, res) => {
    try {
      const auth = getAuth(req);
      const userId = auth?.userId;

      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      console.log(`\n💳 Creating checkout link for user: ${userId}`);

      // Try to get email and name from Clerk backend first
      let userEmail = '';
      let userName = '';

      try {
        const user = await clerkClient.users.getUser(userId);
        console.log('Clerk user fetched successfully:', userId);

        // Get primary email
        const primaryEmail = user.emailAddresses.find(
          (email: any) => email.id === user.primaryEmailAddressId
        );
        userEmail = primaryEmail?.emailAddress || user.emailAddresses[0]?.emailAddress || '';

        // Get name
        userName = user.fullName || 
                   (user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : '') ||
                   user.firstName || 
                   user.lastName || 
                   user.username || 
                   'CVGenie User';

        console.log('Email extracted:', userEmail ? 'Found' : 'Not found');
      } catch (clerkError: any) {
        console.error('Clerk API error, falling back to session claims:', clerkError.message);

        // Fallback: Try session claims
        const sessionClaims = auth.sessionClaims as any;

        // Try multiple possible email field names
        userEmail = sessionClaims?.email || 
                   sessionClaims?.primary_email || 
                   sessionClaims?.email_address ||
                   sessionClaims?.emailAddress || 
                   '';

        // Try to get name from session claims
        userName = sessionClaims?.name || 
                  sessionClaims?.full_name ||
                  (sessionClaims?.firstName && sessionClaims?.lastName 
                    ? `${sessionClaims.firstName} ${sessionClaims.lastName}`.trim() 
                    : '') ||
                  sessionClaims?.firstName ||
                  sessionClaims?.lastName ||
                  sessionClaims?.username ||
                  'CVGenie User';
      }

      // If still no email, return error
      if (!userEmail || userEmail.trim() === '') {
        console.error(`User ${userId} has no email available`);
        return res.status(400).json({ 
          error: "Unable to retrieve email from your account. Please contact support." 
        });
      }

      const existingSubscription = await getUserSubscription(userId);

      // Only initialize if user doesn't exist or is not already Pro
      if (!existingSubscription.dodoCustomerId) {
        await updateUserSubscription(userId, '', '', 'free');
      }

      // SIMPLIFIED: Use direct Dodo Payments checkout link
      // This bypasses API issues and uses the proven checkout page
      const productId = process.env.DODO_PAYMENTS_PRODUCT_ID || 'pdt_4oZICjqHtM1kIMDDDEpTG';

      // Build checkout URL with prefilled customer information
      const checkoutUrl = new URL(`https://checkout.dodopayments.com/buy/${productId}`);
      checkoutUrl.searchParams.set('quantity', '1');
      checkoutUrl.searchParams.set('prefilled_email', userEmail);
      checkoutUrl.searchParams.set('prefilled_customer_name', userName);
      // Add userId as customer reference for webhook identification
      checkoutUrl.searchParams.set('customer_reference', userId);

      const paymentLink = checkoutUrl.toString();

      console.log(`✅ Generated direct checkout link for user ${userId}`);
      console.log(`   Email: ${userEmail}`);
      console.log(`   Name: ${userName}`);
      console.log(`   Link: ${paymentLink}`);

      res.json({
        paymentLink,
      });
    } catch (error: any) {
      console.error("Error creating checkout link:", error);
      console.error("Error stack:", error.stack);

      res.status(500).json({ 
        error: error.message || "Failed to create checkout link. Please try again." 
      });
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

      // Always fetch fresh data from database, never cache
      const subscription = await getUserSubscription(userId); // Use direct import

      // STRICT: User is Pro ONLY if both isPro=1 AND subscriptionStatus='active'
      const isPro = Boolean(subscription?.isPro && subscription?.subscriptionStatus === 'active');

      res.json({
        isPro,
        subscriptionStatus: subscription?.subscriptionStatus || 'free',
        dodoCustomerId: subscription?.dodoCustomerId || undefined,
        dodoSubscriptionId: subscription?.dodoSubscriptionId || undefined,
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

  // POST /api/export/pdf - Export content to PDF
  app.post("/api/export/pdf", async (req, res) => {
    try {
      const { content, filename = "document.pdf" } = req.body;

      if (!content || typeof content !== "string") {
        return res.status(400).json({ error: "Content is required" });
      }

      // Check if user is Pro (optional auth)
      let isPro = false;
      try {
        const auth = getAuth(req);
        if (auth?.userId) {
          const subscription = await getUserSubscriptionStatus(auth.userId);
          isPro = subscription?.isPro || false;
        }
      } catch (e) {
        // User not authenticated, continue as free user
      }

      const pdfBuffer = await documentGenerator.generatePDFFromText(content, { isPro });

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
      res.send(pdfBuffer);
    } catch (error: any) {
      console.error("Error generating PDF:", error);
      res.status(500).json({ error: "Failed to generate PDF" });
    }
  });

  // POST /api/export/docx - Export content to DOCX
  app.post("/api/export/docx", async (req, res) => {
    try {
      const { content, filename = "document.docx" } = req.body;

      if (!content || typeof content !== "string") {
        return res.status(400).json({ error: "Content is required" });
      }

      // Check if user is Pro (optional auth)
      let isPro = false;
      try {
        const auth = getAuth(req);
        if (auth?.userId) {
          const subscription = await getUserSubscriptionStatus(auth.userId);
          isPro = subscription?.isPro || false;
        }
      } catch (e) {
        // User not authenticated, continue as free user
      }

      const docxBuffer = await documentGenerator.generateDOCXFromText(content, { isPro });

      res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
      res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
      res.send(docxBuffer);
    } catch (error: any) {
      console.error("Error generating DOCX:", error);
      res.status(500).json({ error: "Failed to generate DOCX" });
    }
  });

  // POST /api/export/txt - Export content to TXT
  app.post("/api/export/txt", async (req, res) => {
    try {
      const { content, filename = "document.txt" } = req.body;

      if (!content || typeof content !== "string") {
        return res.status(400).json({ error: "Content is required" });
      }

      // Check if user is Pro (optional auth)
      let isPro = false;
      try {
        const auth = getAuth(req);
        if (auth?.userId) {
          const subscription = await getUserSubscriptionStatus(auth.userId);
          isPro = subscription?.isPro || false;
        }
      } catch (e) {
        // User not authenticated, continue as free user
      }

      const txtBuffer = documentGenerator.generateTXTFromText(content, { isPro });

      res.setHeader("Content-Type", "text/plain");
      res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
      res.send(txtBuffer);
    } catch (error: any) {
      console.error("Error generating TXT:", error);
      res.status(500).json({ error: "Failed to generate TXT" });
    }
  });
}