import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  View,
} from "react-native";

import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { LoadingState } from "@/components/ui/loading-state";
import { OrderCard } from "@/components/order/order-card";
import { useInfiniteList } from "@/hooks/use-infinite-list";
import { useOrders } from "@/hooks/use-orders";
import { colors } from "@/lib/theme";

export default function OrdersScreen() {
  const router = useRouter();
  const query = useOrders();
  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    isFetchNextPageError,
    fetchNextPage,
    refetch,
    isRefetching,
  } = query;
  const {
    items: orders,
    totalItems = 0,
    handleEndReached,
  } = useInfiniteList(query);

  if (isLoading) {
    return (
      <View className="flex-1 bg-black">
        <StatusBar style="light" />
        <LoadingState message="Carregando seus pedidos…" />
      </View>
    );
  }

  if (isError && !data) {
    return (
      <View className="flex-1 bg-black">
        <StatusBar style="light" />
        <ErrorState
          title="Não foi possível carregar os pedidos"
          description="Ocorreu um erro ao buscar o seu histórico."
          onRetry={() => void refetch()}
          retryAccessibilityLabel="Tentar carregar os pedidos novamente"
        />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <StatusBar style="light" />

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.4}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 8,
          paddingBottom: 116,
          flexGrow: 1,
        }}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching && !isFetchingNextPage}
            onRefresh={() => void refetch()}
            tintColor={colors.primary.DEFAULT}
            colors={[colors.primary.DEFAULT]}
          />
        }
        ListHeaderComponent={
          <View className="pb-4 pt-2">
            <Text className="font-sans text-3xl font-bold text-white">
              Seus pedidos
            </Text>
            <Text className="mt-1 font-golos text-sm text-white/60">
              {totalItems === 0
                ? "Nenhum pedido realizado até o momento"
                : `${totalItems} ${totalItems === 1 ? "pedido realizado" : "pedidos realizados"}`}
            </Text>
          </View>
        }
        ListEmptyComponent={
          <EmptyState
            className="py-20"
            icon={
              <View className="h-20 w-20 items-center justify-center rounded-full bg-white/5">
                <Ionicons name="receipt-outline" size={40} color="#777179" />
              </View>
            }
            title="Nenhum pedido por aqui"
            description="Quando você fizer uma compra na Spinova, você poderá acompanhar todos os seus pedidos nesta tela."
            action={{
              label: "Explorar catálogo",
              onPress: () => router.replace("/home"),
              accessibilityLabel: "Explorar catálogo de produtos",
            }}
          />
        }
        ListFooterComponent={
          isFetchingNextPage ? (
            <View className="py-6">
              <ActivityIndicator color={colors.primary.DEFAULT} />
            </View>
          ) : isFetchNextPageError ? (
            <Pressable
              onPress={() => void fetchNextPage()}
              accessibilityRole="button"
              accessibilityLabel="Tentar carregar mais pedidos novamente"
              className="items-center py-6"
            >
              <Text className="font-golos-semibold text-sm text-white">
                Não foi possível carregar mais pedidos. Tentar novamente
              </Text>
            </Pressable>
          ) : null
        }
        renderItem={({ item }) => (
          <OrderCard
            order={item}
            onOrderPress={(id) =>
              router.push({ pathname: "/order/[id]", params: { id } })
            }
            onProductPress={(id) =>
              router.push({ pathname: "/product/[id]", params: { id } })
            }
          />
        )}
      />
    </View>
  );
}
