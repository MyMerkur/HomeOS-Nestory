import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(5000),
  MONGO_URI: z.string().min(1, 'MONGO_URI is required'),
  JWT_ACCESS_SECRET: z.string().min(1, 'JWT_ACCESS_SECRET is required'),
  JWT_REFRESH_SECRET: z.string().min(1, 'JWT_REFRESH_SECRET is required'),
  ACCESS_TOKEN_EXPIRES_IN: z.string().default('15m'),
  REFRESH_TOKEN_EXPIRES_IN: z.string().default('30d'),
  CORS_ORIGIN: z.string().default('http://localhost:8081'),
  LOG_LEVEL: z.string().default('info'),
  // Firebase Admin SDK service account JSON (as a single-line string). Optional —
  // until it's provided, push notifications are a no-op (see pushService.ts).
  FIREBASE_SERVICE_ACCOUNT: z.string().optional(),
  // Google Gemini API key for photo-based product identification. Optional —
  // until it's provided, photo identification is a no-op (see productPhotoService.ts).
  GEMINI_API_KEY: z.string().optional(),
});

export const env = envSchema.parse(process.env);
