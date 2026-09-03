import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { expo } from "@better-auth/expo";
import { env } from "@spinova/env/server";
import { openAPI } from "better-auth/plugins";
import { db } from "@spinova/database";
import { authI18n } from "./i18n.ts";

export const auth = betterAuth({
  baseURL: env.BETTER_AUTH_URL,
  secret: env.BETTER_AUTH_SECRET,
  plugins: [openAPI(), expo(), authI18n],
  emailAndPassword: {
    enabled: true,
  },
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  trustedOrigins: [
    "spinova-app://",
    "localhost:*",
    "https://spinova-api-v2.vercel.app",
    "exp://", // Trust all Expo URLs (prefix matching)
    "exp://**", // Trust all Expo URLs (wildcard matching)
    "exp://192.168.*.*:*/**", // Trust 192.168.x.x IP range with any port and path
  ],
});
