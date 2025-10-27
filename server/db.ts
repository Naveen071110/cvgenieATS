/**
 * Database Connection and Query Utilities
 * Uses Neon serverless Postgres with Drizzle ORM
 * Provides connection pooling and async operations
 */

import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";
import * as schema from "@shared/schema";

// Configure WebSocket for Neon serverless (required in Node.js environment)
neonConfig.webSocketConstructor = ws;

// Validate DATABASE_URL environment variable
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error(
    "DATABASE_URL is not configured. Please add it to your environment variables."
  );
}

// Create connection pool for efficient connection management
const pool = new Pool({ connectionString });

// Initialize Drizzle ORM with schema
export const db = drizzle(pool, { schema });

// Export schema for use in queries
export { schema };
