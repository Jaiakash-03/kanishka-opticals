/**
 * Environment variable validation using Zod.
 * Runs at startup — app refuses to start if required vars are missing.
 */
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'staging', 'production']).default('development'),
  PORT: z.string().regex(/^\d+$/).default('3001'),
  API_URL: z.string().url().default('http://localhost:3001'),
  WEB_URL: z.string().url().default('http://localhost:3000'),

  // Security — required in production
  JWT_SECRET: z.string().min(32),
  JWT_ACCESS_EXPIRY: z.string().default('15m'),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_REFRESH_EXPIRY: z.string().default('7d'),
  COOKIE_SECRET: z.string().min(16),

  // Database
  DATABASE_URL: z.string().url(),

  // Redis
  REDIS_URL: z.string().url().default('redis://localhost:6379'),

  // Meilisearch
  MEILISEARCH_HOST: z.string().url().default('http://localhost:7700'),
  MEILISEARCH_MASTER_KEY: z.string().min(1),

  // AWS S3
  AWS_REGION: z.string().default('ap-south-1'),
  AWS_ACCESS_KEY_ID: z.string().min(1),
  AWS_SECRET_ACCESS_KEY: z.string().min(1),
  AWS_S3_BUCKET: z.string().min(1),
  AWS_S3_BUCKET_PRIVATE: z.string().min(1),

  // Razorpay
  RAZORPAY_KEY_ID: z.string().min(1),
  RAZORPAY_KEY_SECRET: z.string().min(1),
  RAZORPAY_WEBHOOK_SECRET: z.string().min(1),
});

/**
 * Called by ConfigModule.forRoot({ validate }).
 * Parses env, throws descriptive errors on missing/invalid vars.
 */
export function envValidationSchema(config: Record<string, unknown>) {
  const result = envSchema.safeParse(config);

  if (!result.success) {
    const errors = result.error.errors
      .map((e) => `  • ${e.path.join('.')}: ${e.message}`)
      .join('\n');

    throw new Error(
      `\n❌ Invalid environment variables:\n${errors}\n\nCheck .env.example for documentation.\n`,
    );
  }

  return result.data;
}
