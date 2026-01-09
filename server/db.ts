// server/db.ts
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// ------------------------
// Load environment variables BEFORE anything else
// ------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env file located in the root folder or fall back to system env
dotenv.config();

// ------------------------
// Database setup
// ------------------------
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";

const connectionString = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "No database URL configured. Set NEON_DATABASE_URL or DATABASE_URL."
  );
}

const pool = new pg.Pool({
  connectionString,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
  ssl: {
    rejectUnauthorized: false
  }
});

export const db = drizzle(pool, { schema });
