import { z } from "zod";
import { parseEnv } from "./parse-env.ts";

export const mobileEnvSchema = z.object({
  EXPO_PUBLIC_API_URL: z.url(),
});

export const env = parseEnv(mobileEnvSchema, {
  EXPO_PUBLIC_API_URL: process.env.EXPO_PUBLIC_API_URL,
});

export type MobileEnv = z.infer<typeof mobileEnvSchema>;
