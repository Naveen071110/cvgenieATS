import { sql } from './neon';
import { dbCache, CACHE_KEYS, CACHE_TTL } from './cache';

export interface Resume {
  id: number;
  user_id: string;
  resume_text: string;
  cover_letter?: string;
  job_description?: string;
  created_at: Date;
  updated_at: Date;
}

export interface ResumeSummary {
  id: number;
  job_description: string | null;
  created_at: Date;
  has_cover_letter: boolean;
}

export async function insertResume(
  userId: string, 
  resumeText: string, 
  coverLetter?: string, 
  jobDescription?: string
): Promise<Resume> {
  const result = await sql`
    INSERT INTO resumes (user_id, resume_text, cover_letter, job_description)
    VALUES (${userId}, ${resumeText}, ${coverLetter || null}, ${jobDescription || null})
    RETURNING *
  `;
  dbCache.invalidate(CACHE_KEYS.resumeHistory(userId));
  return result[0] as Resume;
}

export async function getResumesByUserId(userId: string): Promise<Resume[]> {
  const cacheKey = CACHE_KEYS.resumeHistory(userId);
  const cached = dbCache.get<Resume[]>(cacheKey);
  if (cached) return cached;

  const result = await sql`
    SELECT id, user_id, resume_text, cover_letter, job_description, created_at, updated_at
    FROM resumes 
    WHERE user_id = ${userId}
    ORDER BY created_at DESC
  `;
  const resumes = result as Resume[];
  dbCache.set(cacheKey, resumes, CACHE_TTL.resumeHistory);
  return resumes;
}

export async function getResumeById(id: number, userId: string): Promise<Resume | null> {
  const result = await sql`
    SELECT id, user_id, resume_text, cover_letter, job_description, created_at, updated_at
    FROM resumes 
    WHERE id = ${id} AND user_id = ${userId}
    LIMIT 1
  `;
  return (result[0] as Resume) || null;
}

export async function deleteResume(id: number, userId: string): Promise<boolean> {
  const result = await sql`
    DELETE FROM resumes 
    WHERE id = ${id} AND user_id = ${userId}
    RETURNING id
  `;
  if (result.length > 0) {
    dbCache.invalidate(CACHE_KEYS.resumeHistory(userId));
  }
  return result.length > 0;
}

// Create table if not exists (for initialization)
export async function initializeResumeTable(): Promise<void> {
  await sql`
    CREATE TABLE IF NOT EXISTS resumes (
      id SERIAL PRIMARY KEY,
      user_id VARCHAR(255) NOT NULL,
      resume_text TEXT NOT NULL,
      cover_letter TEXT,
      job_description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  
  // Create indexes if they don't exist
  await sql`
    CREATE INDEX IF NOT EXISTS idx_resumes_user_id ON resumes(user_id)
  `;
  
  await sql`
    CREATE INDEX IF NOT EXISTS idx_resumes_created_at ON resumes(created_at DESC)
  `;
}
