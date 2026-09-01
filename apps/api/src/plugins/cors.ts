import { cors } from "@elysiajs/cors";
import { Elysia } from "elysia";

export const corsPlugin = new Elysia({ name: "cors" }).use(
  cors({
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    origin: (request) => {
      console.log(request);

      return true;
    },
  }),
);
