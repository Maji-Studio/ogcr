import { z } from "zod";

const MOCK_DATABASE_URL = "postgresql://mock:mock@127.0.0.1:5432/ogcr_mock";
const MOCK_APP_URL = "http://localhost:3200";
const MOCK_AUTH_SECRET = "mock-mode-placeholder-not-for-production";

const emptyToUndefined = (value: unknown) =>
  typeof value === "string" && value.trim() === "" ? undefined : value;

/**
 * Environment variable validation schema
 * Ensures all required env vars are present and valid
 */
const envSchema = z.object({
  // Self-contained prototype mode. Real services are an explicit opt-in.
  MOCK_DATA: z
    .string()
    .optional()
    .default("true")
    .transform((val) => val === "true"),

  // Database
  DATABASE_URL: z.string().url().default(MOCK_DATABASE_URL),

  // App URL (used by Better Auth and other services)
  NEXT_PUBLIC_APP_URL: z.string().url().default(MOCK_APP_URL),

  // Better Auth
  BETTER_AUTH_SECRET: z.string().min(32).default(MOCK_AUTH_SECRET),

  // Email (optional for local development)
  RESEND_API_KEY: z.preprocess(emptyToUndefined, z.string().min(1).optional()),
  RESEND_FROM_EMAIL: z.preprocess(
    emptyToUndefined,
    z.string().email().optional()
  ),

  // Optional
  ALLOW_SELF_SIGNUP: z
    .string()
    .optional()
    .default("false")
    .transform((val) => val === "true"),
  DISABLE_AUTH: z
    .string()
    .optional()
    .default("false")
    .transform((val) => val === "true"),
  ADMIN_EMAIL: z.string().email().optional(),
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).optional(),
  DB_POOL_MAX: z.preprocess(
    emptyToUndefined,
    z.coerce.number().int().positive().optional()
  ),
  DB_POOL_IDLE_TIMEOUT_MS: z.preprocess(
    emptyToUndefined,
    z.coerce.number().int().positive().optional()
  ),
  DB_POOL_CONNECTION_TIMEOUT_MS: z.preprocess(
    emptyToUndefined,
    z.coerce.number().int().positive().optional()
  ),
}).superRefine((data, ctx) => {
  const hasApiKey = !!data.RESEND_API_KEY;
  const hasFromEmail = !!data.RESEND_FROM_EMAIL;

  if (hasApiKey !== hasFromEmail) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["RESEND_API_KEY"],
      message:
        "RESEND_API_KEY and RESEND_FROM_EMAIL must either both be set or both be omitted",
    });
  }

  if (!data.MOCK_DATA && data.DATABASE_URL === MOCK_DATABASE_URL) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["DATABASE_URL"],
      message: "DATABASE_URL is required when MOCK_DATA=false",
    });
  }

  if (!data.MOCK_DATA && data.BETTER_AUTH_SECRET === MOCK_AUTH_SECRET) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["BETTER_AUTH_SECRET"],
      message: "BETTER_AUTH_SECRET is required when MOCK_DATA=false",
    });
  }
});

export type Env = z.infer<typeof envSchema>;

// Validate and export environment variables
export const env = envSchema.parse(process.env);
