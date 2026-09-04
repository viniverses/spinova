import { Elysia } from "elysia";
import { node } from "@elysia/node";

import { productRoutes } from "./features/products/product.routes.ts";
import { wishlistRoutes } from "./features/wishlist/wishlist.routes.ts";
import { cartRoutes } from "./features/cart/cart.routes.ts";
import { corsPlugin } from "./plugins/cors.ts";
import { errorHandlerPlugin } from "./plugins/error-handler.ts";
import { swaggerPlugin } from "./plugins/swagger.ts";
import { auth } from "@spinova/auth";

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
app.use(cartRoutes);

// Export
export default app;
