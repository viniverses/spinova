import { StatusBar } from "expo-status-bar";
import { useLocalSearchParams } from "expo-router";
import { useMemo } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View } from "react-native";
import { ProductGrid } from "@/components/product/product-grid";
import { ProductListHeader } from "@/components/product/product-list-header";
import { useInfiniteProducts } from "@/hooks/use-infinite-products";
import type { ProductCollection } from "@/services/products";

const COLLECTION_CONFIG: Record<
  string,
  { collection: ProductCollection; title: string; emptyMessage: string }
> = {
  bestsellers: {
    collection: "bestsellers",
    title: "Mais vendidos",
    emptyMessage: "Nenhum produto mais vendido no momento.",
  },
  new: {
    collection: "new",
    title: "Novos",
    emptyMessage: "Nenhum produto novo no momento.",
  },
  promo: {
    collection: "promotions",
    title: "Promoções",
    emptyMessage: "Nenhuma promoção disponível no momento.",
  },
  import: {
    collection: "imported",
    title: "Importados",
    emptyMessage: "Nenhum produto importado disponível no momento.",
  },
  national: {
    collection: "national",
    title: "Nacionais",
    emptyMessage: "Nenhum produto nacional disponível no momento.",
  },
};

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
    config ? { collection: config.collection, pageSize: PAGE_SIZE } : {},
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
