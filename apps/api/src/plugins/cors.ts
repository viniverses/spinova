import { cors } from "@elysiajs/cors";
import { Elysia } from "elysia";

export const corsPlugin = new Elysia({ name: "cors" }).use(
  cors({
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    origin: () => {
      return true;
    },
  }),
);
