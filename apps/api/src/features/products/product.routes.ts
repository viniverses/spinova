import { NotFoundError } from "../../errors/index.ts";
import { Elysia } from "elysia";

import { normalizeProductListQuery } from "./product.filters.ts";
import { findProductById, listProducts } from "./product.repository.ts";
import {
  BadRequestResponseSchema,
  InternalServerErrorResponseSchema,
  NotFoundResponseSchema,
  ProductDetailResponseSchema,
  ProductListQuerySchema,
  ProductListResponseSchema,
  ProductParamsSchema,
  ValidationErrorResponseSchema,
} from "./product.schemas.ts";

export const productRoutes = new Elysia({
  name: "product-routes",
  normalize: "typebox",
})
  .get(
    "/products",
    ({ query }) => {
      return listProducts(normalizeProductListQuery(query));
    },
    {
      query: ProductListQuerySchema,
      response: {
        200: ProductListResponseSchema,
        400: BadRequestResponseSchema,
        422: ValidationErrorResponseSchema,
        500: InternalServerErrorResponseSchema,
      },
      detail: {
        operationId: "listProducts",
        summary: "List products",
        description:
          "Returns paginated products for the catalog and home screen. Supports combinable filters, dynamic collections, and curated sections.",
        tags: ["Products"],
      },
    },
  )
  .get(
    "/products/:id",
    async ({ params }) => {
      const product = await findProductById(params.id);
      if (!product) {
        throw new NotFoundError({
          code: "PRODUCT_NOT_FOUND",
          message: "Product not found.",
          details: { productId: params.id },
        });
      }
      return product;
    },
    {
      params: ProductParamsSchema,
      response: {
        200: ProductDetailResponseSchema,
        404: NotFoundResponseSchema,
        422: ValidationErrorResponseSchema,
        500: InternalServerErrorResponseSchema,
      },
      detail: {
        operationId: "getProductById",
        summary: "Get a product",
        description:
          "Returns complete data for a product edition, including images, tags, and categories.",
        tags: ["Products"],
      },
    },
  );
