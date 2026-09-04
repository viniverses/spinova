import { z } from "zod";
import { parseEnv } from "./parse-env.ts";

export const mobileEnvSchema = z.object({
  EXPO_PUBLIC_API_URL: z.url(),
  EXPO_PUBLIC_WEB_API_URL: z.url(),
});

export const env = parseEnv(mobileEnvSchema, {
  EXPO_PUBLIC_API_URL: process.env.EXPO_PUBLIC_API_URL,
  EXPO_PUBLIC_WEB_API_URL: process.env.EXPO_PUBLIC_WEB_API_URL,
});

export type MobileEnv = z.infer<typeof mobileEnvSchema>;
