import { swagger } from "@elysiajs/swagger";
import { Elysia } from "elysia";

import { env } from "@spinova/env/server";

export const swaggerPlugin = new Elysia({ name: "swagger" }).use(
  swagger({
    path: "/docs",
    documentation: {
      info: {
        title: "Spinova API",
        version: env.API_VERSION,
        description: "Spinova catalog and e-commerce API.",
      },
      tags: [
        {
          name: "Products",
          description: "Product catalog, filters, and details.",
        },
        {
          name: "Wishlist",
          description: "Authenticated user wishlist management.",
        },
      ],
    },
  }),
);
