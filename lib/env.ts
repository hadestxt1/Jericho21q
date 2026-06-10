import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().url().optional(),
  PAYMENT_GATEWAY_API_KEY: z.string().min(1).optional(),
  PAYMENT_GATEWAY_WEBHOOK_SECRET: z.string().min(1).optional(),
  PROVIDER_API_KEY: z.string().min(1).optional(),
  PROVIDER_BASE_URL: z.string().url().optional(),
  ADMIN_SHARED_SECRET: z.string().min(1).optional(),
});

export const env = envSchema.parse(process.env);

export function requireConfigured(name: keyof typeof env) {
  const value = env[name];
  if (!value) {
    throw new Error(`${name} is not configured. Add it to your deployment environment.`);
  }
  return value;
}
