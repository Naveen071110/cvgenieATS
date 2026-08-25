import rateLimit from "express-rate-limit";
import type { Request, Response } from "express";
import { getAuth } from "@clerk/express";

// Key generator: rate limit by authenticated Clerk User ID or client IP
const keyGenerator = (req: Request): string => {
  try {
    const auth = getAuth(req);
    if (auth?.userId) {
      return auth.userId;
    }
  } catch (e) {
    // Ignore auth extraction error for unauthenticated requests
  }
  return req.ip || req.headers["x-forwarded-for"]?.toString() || "unknown-ip";
};

/**
 * Rate limiter for expensive AI generation calls (DeepSeek)
 * Max 15 generation requests per 15 minutes window
 */
export const generateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  keyGenerator,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many resume generation requests. Please wait a few minutes before trying again.",
  },
});

/**
 * Rate limiter for file uploads and document parsing
 * Max 30 file uploads per 15 minutes window
 */
export const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  keyGenerator,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many file upload attempts. Please wait a few minutes before trying again.",
  },
});

/**
 * Rate limiter for interview preparation question generation
 * Max 20 requests per 15 minutes window
 */
export const interviewLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  keyGenerator,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many interview question requests. Please wait a few minutes before trying again.",
  },
});
