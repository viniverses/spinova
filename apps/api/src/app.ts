import { Elysia, type AnyElysia } from "elysia";
import type { auth } from "@spinova/auth";

import { corsPlugin } from "./http/plugins/cors.ts";
import { errorHandlerPlugin } from "./http/plugins/error-handler.ts";
import { swaggerPlugin } from "./http/plugins/swagger.ts";

export interface AppRouteModules {
  productRoutes: AnyElysia;
  wishlistRoutes: AnyElysia;
  cartRoutes: AnyElysia;
  orderRoutes: AnyElysia;
  checkoutRoutes: AnyElysia;
  addressRoutes: AnyElysia;
}

export interface AppDependencies {
  authHandler: typeof auth.handler;
  routeModules: AppRouteModules;
}

export const createApp = ({ authHandler, routeModules }: AppDependencies) => {
  const {
    productRoutes,
    wishlistRoutes,
    cartRoutes,
    orderRoutes,
    checkoutRoutes,
    addressRoutes,
  } = routeModules;

  return new Elysia({ normalize: "typebox" })
    .get("/", () => "OK")
    .use(swaggerPlugin)
    .use(errorHandlerPlugin)
    .use(corsPlugin)
    .mount(authHandler)
    .use(productRoutes)
    .use(wishlistRoutes)
    .use(cartRoutes)
    .use(orderRoutes)
    .use(checkoutRoutes)
    .use(addressRoutes);
};
