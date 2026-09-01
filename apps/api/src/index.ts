import { Elysia } from "elysia";
import { node } from "@elysia/node";

import { productRoutes } from "./features/products/product.routes.ts";
import { wishlistRoutes } from "./features/wishlist/wishlist.routes.ts";
import { corsPlugin } from "./plugins/cors.ts";
import { errorHandlerPlugin } from "./plugins/error-handler.ts";
import { swaggerPlugin } from "./plugins/swagger.ts";
import { auth } from "@repo/auth";

const app = new Elysia({ adapter: node() });

// Health check
app.get("/", () => "OK");

// Plugins
app.use(swaggerPlugin);
app.use(errorHandlerPlugin);
app.use(corsPlugin);

// Better Auth
app.mount(auth.handler);

// Routes
app.use(productRoutes);
app.use(wishlistRoutes);

// Export
export default app;
