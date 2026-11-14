import { useCallback, useMemo } from "react";

type InfiniteListQuery<T> = {
  data?: {
    pages: {
      data: T[];
      pagination: { totalItems: number };
    }[];
  };
  hasNextPage: boolean;
  isFetching: boolean;
  isFetchNextPageError: boolean;
  fetchNextPage: () => Promise<unknown>;
};

export function useInfiniteList<T>(
  {
    data,
    hasNextPage,
    isFetching,
    isFetchNextPageError,
    fetchNextPage,
  }: InfiniteListQuery<T>,
  { enabled = true }: { enabled?: boolean } = {},
) {
  const items = useMemo(
    () => (enabled ? data?.pages.flatMap((page) => page.data) ?? [] : []),
    [data, enabled],
  );
  const totalItems = enabled ? data?.pages[0]?.pagination.totalItems : undefined;

  const handleEndReached = useCallback(() => {
    if (enabled && hasNextPage && !isFetching && !isFetchNextPageError) {
      void fetchNextPage();
    }
  }, [enabled, hasNextPage, isFetching, isFetchNextPageError, fetchNextPage]);

  return { items, totalItems, handleEndReached };
}
