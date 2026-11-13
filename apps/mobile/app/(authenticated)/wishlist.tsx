import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import {
  FlatList,
  RefreshControl,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { LoadingState } from "@/components/ui/loading-state";
import { ProductCard } from "@/components/product/product-card";
import { useWishlist } from "@/hooks/use-wishlist";
import { colors } from "@/lib/theme";

const GRID_GAP = 14;

export default function WishlistScreen() {
  const { width } = useWindowDimensions();
  const wishlist = useWishlist();
  const items = wishlist.data ?? [];

  const itemLabel = `${items.length} ${items.length === 1 ? "item salvo" : "itens salvos"}`;
  const cardWidth = (width - 32 - GRID_GAP) / 2;

  return (
    <View className="flex-1 bg-black">
      <StatusBar style="light" />

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={{ gap: GRID_GAP }}
        contentContainerStyle={{
          flexGrow: 1,
          gap: GRID_GAP,
          paddingHorizontal: 16,
          paddingBottom: 112,
        }}
        refreshControl={
          <RefreshControl
            refreshing={wishlist.isRefetching}
            onRefresh={() => void wishlist.refetch()}
            tintColor={colors.primary.DEFAULT}
            colors={[colors.primary.DEFAULT]}
          />
        }
        ListHeaderComponent={
          <View className="pb-5 pt-3">
            <View className="flex-row items-start justify-between gap-4">
              <View className="flex-1">
                <Text className="font-sans text-3xl leading-9 text-white">
                  Lista de desejos
                </Text>
                <Text className="mt-2 font-golos text-sm leading-5 text-white/60">
                  Os discos que você quer ouvir de perto, guardados em um só
                  lugar.
                </Text>
              </View>

              <View className="mt-1 h-12 w-12 items-center justify-center rounded-2xl bg-[#2C292E]">
                <Ionicons
                  name="heart"
                  size={23}
                  color={colors.primary.DEFAULT}
                />
              </View>
            </View>

            {!wishlist.isPending && !wishlist.isError ? (
              <View className="mt-5 flex-row items-center gap-2 border-b border-white/10 pb-4">
                <View className="h-2 w-2 rounded-full bg-primary" />
                <Text className="font-golos-semibold text-sm text-white/75">
                  {itemLabel}
                </Text>
              </View>
            ) : null}
          </View>
        }
        ListEmptyComponent={
          wishlist.isPending ? (
            <LoadingState
              className="pb-28"
              message="Carregando seus favoritos…"
            />
          ) : wishlist.isError ? (
            <ErrorState
              className="pb-28"
              icon={
                <Ionicons
                  name="cloud-offline-outline"
                  size={48}
                  color="#777179"
                />
              }
              title="Sua lista não carregou"
              description="Verifique sua conexão e tente novamente."
              onRetry={() => void wishlist.refetch()}
              retryAccessibilityLabel="Tentar carregar a lista novamente"
            />
          ) : (
            <EmptyState
              className="pb-28"
              icon={<Ionicons name="heart-outline" size={52} color="#777179" />}
              title="Sua lista está esperando"
              description="Toque no coração de um produto para encontrá-lo aqui depois."
            />
          )
        }
        renderItem={({ item }) => (
          <ProductCard
            product={item.product}
            width={cardWidth}
            isWishlistItem
          />
        )}
      />
    </View>
  );
}
