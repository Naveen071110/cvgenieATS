import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const generations = pgTable("generations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: text("session_id").notNull(),
  originalResume: text("original_resume").notNull(),
  jobDescription: text("job_description").notNull(),
  optimizedResume: text("optimized_resume").notNull(),
  coverLetter: text("cover_letter").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const usageSessions = pgTable("usage_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: text("session_id").notNull().unique(),
  generationsUsed: integer("generations_used").default(0),
  isPro: integer("is_pro").default(0), // 0 = false, 1 = true
  createdAt: timestamp("created_at").defaultNow(),
});

// User-specific resume history table for Clerk-authenticated users
export const resumes = pgTable("resumes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: text("user_id").notNull(), // Clerk user ID
  resumeData: text("resume_data").notNull(), // Optimized resume content
  jobDescription: text("job_description").notNull(), // Job description used
  coverLetter: text("cover_letter").notNull(), // Generated cover letter
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertGenerationSchema = createInsertSchema(generations).omit({
  id: true,
  createdAt: true,
});

export const insertUsageSessionSchema = createInsertSchema(usageSessions).omit({
  id: true,
  createdAt: true,
});

export const insertResumeSchema = createInsertSchema(resumes).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Generation = typeof generations.$inferSelect;
export type UsageSession = typeof usageSessions.$inferSelect;
export type InsertGeneration = z.infer<typeof insertGenerationSchema>;
export type InsertUsageSession = z.infer<typeof insertUsageSessionSchema>;
export type Resume = typeof resumes.$inferSelect;
export type InsertResume = z.infer<typeof insertResumeSchema>;
