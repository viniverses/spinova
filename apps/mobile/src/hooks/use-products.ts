import { useQuery } from "@tanstack/react-query";
import { getProducts, type ProductListParams } from "@/services/products";

export const productKeys = {
  all: ["products"] as const,
  list: (params: ProductListParams) =>
    [...productKeys.all, "list", params] as const,
};

export const useProducts = (params: ProductListParams = {}) =>
  useQuery({
    queryKey: productKeys.list(params),
    queryFn: () => getProducts(params),
  });
