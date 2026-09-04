import { useInfiniteQuery } from "@tanstack/react-query";
import { getProducts, type ProductListParams } from "@/services/products";

export const useInfiniteProducts = (
  params: Omit<ProductListParams, "page"> = {},
  options?: { enabled?: boolean },
) =>
  useInfiniteQuery({
    queryKey: ["products", "infinite", params],
    queryFn: ({ pageParam = 1 }) =>
      getProducts({ ...params, page: pageParam as number }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    ...options,
  });
