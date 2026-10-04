import { Elysia } from "elysia";

import { FindProductByIdUseCase } from "../../application/use-cases/find-product-by-id.use-case.ts";
import { ListProductsUseCase } from "../../application/use-cases/list-products.use-case.ts";
import type { IProductRepository } from "../../domain/repositories/product.repository.interface.ts";
import { productErrorMapper } from "./product.error-mapper.ts";
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

export interface ProductRoutesDependencies {
  productRepository: IProductRepository;
}

export const createProductRoutes = (deps: ProductRoutesDependencies) => {
  const listProductsUseCase = new ListProductsUseCase(deps.productRepository);
  const findProductByIdUseCase = new FindProductByIdUseCase(
    deps.productRepository,
  );

  return new Elysia({
    prefix: "/products",
    name: "product-routes",
    normalize: "typebox",
  })
    .use(productErrorMapper)
    .get(
      "/",
      async ({ query }) => {
        const result = await listProductsUseCase.execute(query);
        return { data: result.items, pagination: result.pagination };
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
      "/:id",
      async ({ params }) => {
        const product = await findProductByIdUseCase.execute({ id: params.id });
        return { data: product };
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
};
