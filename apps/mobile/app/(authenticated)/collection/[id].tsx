import { StatusBar } from "expo-status-bar";
import { useLocalSearchParams } from "expo-router";
import { View } from "react-native";
import { findCollection } from "@/constants/collections";
import { ProductGrid } from "@/components/product/product-grid";
import { ProductListHeader } from "@/components/product/product-list-header";
import { useInfiniteList } from "@/hooks/use-infinite-list";
import { useInfiniteProducts } from "@/hooks/use-infinite-products";

const PAGE_SIZE = 20;

export default function CollectionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const config = findCollection(id ?? "");

  const query = useInfiniteProducts(
    config ? { ...config.params, pageSize: PAGE_SIZE } : {},
  );

  const {
    isPending,
    isError,
    isFetchingNextPage,
    hasNextPage,
    refetch,
    isRefetching,
  } = query;

  const { items, totalItems, handleEndReached } = useInfiniteList(query);

  const title = config?.label ?? "Produtos";
  const emptyMessage = config?.emptyMessage ?? "Nenhum produto encontrado.";

  return (
    <View className="flex-1 bg-black">
      <StatusBar style="light" />
      <ProductListHeader
        title={title}
        totalItems={!isPending && !isError ? totalItems : undefined}
      />

      <ProductGrid
        items={items}
        isLoading={isPending}
        isError={isError && !isPending}
        isFetchingNextPage={isFetchingNextPage}
        hasNextPage={!!hasNextPage}
        isRefreshing={isRefetching && !isFetchingNextPage}
        onRefresh={() => void refetch()}
        onRetry={() => void refetch()}
        onEndReached={handleEndReached}
        emptyMessage={emptyMessage}
      />
    </View>
  );
}
