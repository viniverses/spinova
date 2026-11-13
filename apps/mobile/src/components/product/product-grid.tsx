import { useCallback } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { LoadingState } from "@/components/ui/loading-state";
import type { ProductCatalogItem } from "@/services/products";
import { useWishlistIds } from "@/hooks/use-wishlist";
import { colors } from "@/lib/theme";
import { ProductCard } from "./product-card";

type ProductGridProps = {
  items: ProductCatalogItem[];
  isLoading: boolean;
  isError: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  isRefreshing?: boolean;
  onRefresh?: () => void;
  onRetry: () => void;
  onEndReached: () => void;
  showFavorite?: boolean;
  ListHeaderComponent?: React.ReactElement;
  emptyMessage?: string;
};

const COLUMN_GAP = 12;
const H_PADDING = 16;
const NUM_COLUMNS = 2;

export const ProductGrid = ({
  items,
  isLoading,
  isError,
  isFetchingNextPage,
  hasNextPage,
  isRefreshing = false,
  onRefresh,
  onRetry,
  onEndReached,
  showFavorite = true,
  ListHeaderComponent,
  emptyMessage = "Nenhum produto encontrado.",
}: ProductGridProps) => {
  const { width } = useWindowDimensions();
  const cardWidth =
    (width - H_PADDING * 2 - COLUMN_GAP * (NUM_COLUMNS - 1)) / NUM_COLUMNS;

  const { data: wishlistIds } = useWishlistIds({ enabled: showFavorite });

  const renderItem = useCallback(
    ({ item }: { item: ProductCatalogItem }) => (
      <ProductCard
        product={item}
        width={cardWidth}
        showFavorite={showFavorite}
        isWishlisted={wishlistIds ? wishlistIds.has(item.id) : undefined}
      />
    ),
    [cardWidth, showFavorite, wishlistIds],
  );

  if (isLoading) {
    return <LoadingState />;
  }

  if (isError) {
    return (
      <ErrorState
        title="Não foi possível carregar os produtos."
        onRetry={onRetry}
      />
    );
  }

  return (
    <FlatList
      data={items}
      keyExtractor={(item) => item.id}
      numColumns={NUM_COLUMNS}
      showsVerticalScrollIndicator={false}
      removeClippedSubviews={true}
      maxToRenderPerBatch={8}
      windowSize={5}
      initialNumToRender={8}
      contentContainerStyle={{
        paddingHorizontal: H_PADDING,
        paddingBottom: 112,
        paddingTop: 8,
        gap: COLUMN_GAP,
      }}
      columnWrapperStyle={{ gap: COLUMN_GAP }}
      ListHeaderComponent={ListHeaderComponent}
      ListEmptyComponent={
        <EmptyState className="pt-16" description={emptyMessage} />
      }
      ListFooterComponent={
        isFetchingNextPage ? (
          <View className="py-6">
            <ActivityIndicator color={colors.primary.DEFAULT} />
          </View>
        ) : !hasNextPage && items.length > 0 ? (
          <Text className="py-6 text-center font-golos text-xs text-white/30">
            Todos os produtos foram carregados
          </Text>
        ) : null
      }
      onEndReached={onEndReached}
      onEndReachedThreshold={0.4}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary.DEFAULT}
            colors={[colors.primary.DEFAULT]}
          />
        ) : undefined
      }
      renderItem={renderItem}
    />
  );
};
