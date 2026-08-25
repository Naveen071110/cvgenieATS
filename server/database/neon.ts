// ONLY connect to external Neon Postgres - NO local DB
import { neon } from '@neondatabase/serverless';

function createNeonSql() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    return (((..._args: any[]) => {
      throw new Error('DATABASE_URL environment variable is not set. Please configure DATABASE_URL in .env');
    }) as any);
  }

  try {
    return neon(url);
  } catch (err: any) {
    console.warn(`⚠️ Warning: Invalid DATABASE_URL format (${err.message}). Database features will be unavailable.`);
    return (((..._args: any[]) => {
      throw new Error(`Database connection failed due to invalid DATABASE_URL format: ${err.message}`);
    }) as any);
  }
}

export const sql = createNeonSql();
