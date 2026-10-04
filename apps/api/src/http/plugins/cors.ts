import { cors } from "@elysiajs/cors";
import { env } from "@spinova/env/server";
import { Elysia } from "elysia";

const allowedOrigins = [env.WEB_APP_URL, "http://localhost:8081"].filter(
  (origin): origin is string => Boolean(origin),
);

export const corsPlugin = new Elysia({ name: "cors" }).use(
  cors({
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    origin: allowedOrigins,
  }),
);
