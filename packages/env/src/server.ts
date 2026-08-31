import { z } from "zod";
import { parseEnv } from "./parse-env.ts";

export const serverEnvSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  API_HOSTNAME: z.string().trim().min(1).default("localhost"),
  PORT: z.coerce.number().int().min(1).max(65_535).default(3_000),
  API_VERSION: z.string().trim().min(1),
  BETTER_AUTH_SECRET: z.string().min(32),
  BETTER_AUTH_URL: z.url(),
  DATABASE_URL: z.url(),
});

export const env = parseEnv(serverEnvSchema, process.env);

export type ServerEnv = z.infer<typeof serverEnvSchema>;
