type NodeEnv = "development" | "production" | "test";

const NODE_ENV = (process.env.NODE_ENV ?? "development") as NodeEnv;

export const env = {
  NODE_ENV,
  isProd: NODE_ENV === "production",
  isDev: NODE_ENV === "development",
  isTest: NODE_ENV === "test",
} as const;
