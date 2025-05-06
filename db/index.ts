import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../shared/schema';
import 'dotenv/config';

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// إنشاء عميل postgres
const client = postgres(process.env.DATABASE_URL);

// إنشاء كائن drizzle
export const db = drizzle(client, { schema });