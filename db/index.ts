import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../shared/schema';
import 'dotenv/config';

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// إنشاء عميل postgres مع إعدادات مخصصة
const client = postgres(process.env.DATABASE_URL, { 
  max: 10, // عدد الاتصالات المتزامنة المسموح بها
  idle_timeout: 20, // زمن انتهاء الاتصال الغير مستخدم
  connect_timeout: 10, // زمن انتهاء محاولة الاتصال
});

// إنشاء كائن drizzle مع تكوين السجلات
export const db = drizzle(client, { 
  schema,
});