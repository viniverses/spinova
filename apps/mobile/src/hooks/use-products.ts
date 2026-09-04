import { useQuery } from "@tanstack/react-query";
import {
  getProductById,
  getProducts,
  type ProductListParams,
} from "@/services/products";

export const productKeys = {
  all: ["products"] as const,
  list: (params: ProductListParams) =>
    [...productKeys.all, "list", params] as const,
  detail: (productId: string) =>
    [...productKeys.all, "detail", productId] as const,
};

export const useProducts = (params: ProductListParams = {}) =>
  useQuery({
    queryKey: productKeys.list(params),
    queryFn: () => getProducts(params),
  });

export const useProduct = (productId: string) =>
  useQuery({
    queryKey: productKeys.detail(productId),
    queryFn: () => getProductById(productId),
    enabled: productId.length > 0,
  });
