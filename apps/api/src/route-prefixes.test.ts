import { beforeAll, describe, expect, it } from "vitest";
import { Elysia } from "elysia";

process.env.API_VERSION = "v1";
process.env.BETTER_AUTH_SECRET = "12345678901234567890123456789012";
process.env.BETTER_AUTH_URL = "http://localhost:3000";
process.env.DATABASE_URL = "postgres://localhost:5432/spinova";

const {
  addressRoutes,
  cartRoutes,
  checkoutRoutes,
  orderRoutes,
  productRoutes,
  wishlistRoutes,
} = await import("./composition-root.ts").then(({ createRouteModules }) =>
  createRouteModules(),
);

describe("Elysia Route Prefixes", () => {
  it("registers cart routes with /cart prefix", () => {
    const routePaths = cartRoutes.routes.map((r) => `${r.method} ${r.path}`);

    expect(routePaths).toContain("GET /cart/");
    expect(routePaths).toContain("POST /cart/items/:productId");
    expect(routePaths).toContain("PATCH /cart/items/:productId");
  });

  it("registers order query routes with /orders prefix", () => {
    const routePaths = orderRoutes.routes.map((r) => `${r.method} ${r.path}`);

    expect(routePaths).toContain("GET /orders/");
    expect(routePaths).toContain("GET /orders/:id");
  });

  it("registers checkout route with /orders prefix", () => {
    const routePaths = checkoutRoutes.routes.map(
      (r) => `${r.method} ${r.path}`,
    );

    expect(routePaths).toContain("POST /orders/");
  });

  it("registers address routes with /addresses prefix", () => {
    const routePaths = addressRoutes.routes.map((r) => `${r.method} ${r.path}`);

    expect(routePaths).toContain("GET /addresses/");
    expect(routePaths).toContain("GET /addresses/default");
    expect(routePaths).toContain("POST /addresses/");
    expect(routePaths).toContain("PATCH /addresses/:addressId");
    expect(routePaths).toContain("DELETE /addresses/:addressId");
  });

  it("registers wishlist routes with /wishlist prefix", () => {
    const routePaths = wishlistRoutes.routes.map(
      (r) => `${r.method} ${r.path}`,
    );

    expect(routePaths).toContain("GET /wishlist/");
    expect(routePaths).toContain("POST /wishlist/:productId");
    expect(routePaths).toContain("DELETE /wishlist/:productId");
  });

  it("registers product routes with /products prefix", () => {
    const routePaths = productRoutes.routes.map((r) => `${r.method} ${r.path}`);

    expect(routePaths).toContain("GET /products/");
    expect(routePaths).toContain("GET /products/:id");
  });

  it("matches incoming requests without trailing slashes", async () => {
    const { node } = await import("@elysia/node");
    const { errorHandlerPlugin } =
      await import("./http/plugins/error-handler.ts");

    const app = new Elysia({ adapter: node(), normalize: "typebox" })
      .use(errorHandlerPlugin)
      .use(cartRoutes)
      .use(orderRoutes)
      .use(checkoutRoutes)
      .use(addressRoutes)
      .use(wishlistRoutes);

    const cartRes = await app.handle(new Request("http://localhost/cart"));
    expect(cartRes.status).toBe(401);

    const ordersRes = await app.handle(new Request("http://localhost/orders"));
    expect(ordersRes.status).toBe(401);

    const addressesRes = await app.handle(
      new Request("http://localhost/addresses"),
    );
    expect(addressesRes.status).toBe(401);

    const wishlistRes = await app.handle(
      new Request("http://localhost/wishlist"),
    );
    expect(wishlistRes.status).toBe(401);
  });
});
