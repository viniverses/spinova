import { StatusBar } from "expo-status-bar";
import { useLocalSearchParams } from "expo-router";
import { useMemo } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View } from "react-native";
import { COLLECTION_CONFIG } from "@/components/product/constants";
import { ProductGrid } from "@/components/product/product-grid";
import { ProductListHeader } from "@/components/product/product-list-header";
import { useInfiniteProducts } from "@/hooks/use-infinite-products";

const PAGE_SIZE = 20;

export default function CollectionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const config = COLLECTION_CONFIG[id ?? ""];

  const {
    data,
    isPending,
    isError,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
    isRefetching,
  } = useInfiniteProducts(
    config ? { ...config.params, pageSize: PAGE_SIZE } : {},
  );

  const items = useMemo(() => data?.pages.flatMap((p) => p.data) ?? [], [data]);

  const totalItems = data?.pages[0]?.pagination.totalItems;

  const handleEndReached = () => {
    if (hasNextPage && !isFetchingNextPage) {
      void fetchNextPage();
    }
  };

  const title = config?.title ?? "Produtos";
  const emptyMessage = config?.emptyMessage ?? "Nenhum produto encontrado.";

  return (
    <View className="flex-1 bg-black">
      <StatusBar style="light" />
      <SafeAreaView className="bg-black" edges={["top", "left", "right"]}>
        <ProductListHeader
          title={title}
          totalItems={!isPending && !isError ? totalItems : undefined}
        />
      </SafeAreaView>

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
