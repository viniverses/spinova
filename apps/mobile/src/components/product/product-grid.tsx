import { Ionicons } from "@expo/vector-icons";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import type { ProductListItem } from "@/services/products";
import { colors } from "@/lib/theme";
import { ProductCard } from "./product-card";

type ProductGridProps = {
  items: ProductListItem[];
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
  const cardHeight = cardWidth * 1.1;

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator color={colors.primary.DEFAULT} size="large" />
      </View>
    );
  }

  if (isError) {
    return (
      <View className="flex-1 items-center justify-center px-6">
        <Ionicons
          name="alert-circle-outline"
          size={48}
          color={colors.primary.DEFAULT}
        />
        <Text className="mt-3 text-center font-golos text-base text-white/80">
          Não foi possível carregar os produtos.
        </Text>
        <Pressable
          onPress={onRetry}
          accessibilityRole="button"
          accessibilityLabel="Tentar novamente"
          className="mt-4 rounded-2xl bg-primary px-6 py-3 active:opacity-80"
        >
          <Text className="font-golos-semibold text-sm text-white">
            Tentar novamente
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <FlatList
      data={items}
      keyExtractor={(item) => item.id}
      numColumns={NUM_COLUMNS}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingHorizontal: H_PADDING,
        paddingBottom: 112,
        paddingTop: 8,
        gap: COLUMN_GAP,
      }}
      columnWrapperStyle={{ gap: COLUMN_GAP }}
      ListHeaderComponent={ListHeaderComponent}
      ListEmptyComponent={
        <View className="flex-1 items-center justify-center px-6 pt-16">
          <Ionicons name="disc-outline" size={48} color="#444" />
          <Text className="mt-3 text-center font-golos text-base text-white/50">
            {emptyMessage}
          </Text>
        </View>
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
      renderItem={({ item }) => (
        <ProductCard
          product={item}
          width={cardWidth}
          height={cardHeight}
          variant="homeRelease"
          showFavorite={showFavorite}
        />
      )}
    />
  );
};
