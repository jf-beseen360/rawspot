import { z } from "zod";

const schema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  // Supabase Auth — required at runtime when auth code is exercised.
  NEXT_PUBLIC_SUPABASE_URL: z
    .string()
    .min(1, "NEXT_PUBLIC_SUPABASE_URL is required"),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z
    .string()
    .min(1, "NEXT_PUBLIC_SUPABASE_ANON_KEY is required"),
});

export type Env = Readonly<
  z.infer<typeof schema> & {
    isProd: boolean;
    isDev: boolean;
    isTest: boolean;
  }
>;

let _env: Env | null = null;

// Lazy by design: validation runs on first access (request time / seed start),
// not at module load. This lets `next build` succeed without the secrets
// because routes consuming env are dynamic and never execute during the
// build's prerender pass.
export function getEnv(): Env {
  if (_env) return _env;
  const parsed = schema.parse({
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_URL: process.env.DATABASE_URL,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  });
  _env = Object.freeze({
    ...parsed,
    isProd: parsed.NODE_ENV === "production",
    isDev: parsed.NODE_ENV === "development",
    isTest: parsed.NODE_ENV === "test",
  });
  return _env;
}
