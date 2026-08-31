import { defineConfig } from "drizzle-kit";
import { env } from "@package/env/server";

export default defineConfig({
  out: "./migrations",
  schema: "./src/schema",
  dialect: "postgresql",
  casing: "snake_case",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
});
