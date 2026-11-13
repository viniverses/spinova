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

import { OrderCard } from "@/components/order/order-card";
import { useOrders } from "@/hooks/use-orders";
import { colors } from "@/lib/theme";

export default function OrdersScreen() {
  const router = useRouter();
  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    isFetchNextPageError,
    hasNextPage,
    fetchNextPage,
    refetch,
    isRefetching,
  } = useOrders();
  const orders = data?.pages.flatMap((page) => page.data) ?? [];
  const totalItems = data?.pages[0]?.pagination.totalItems ?? 0;

  const handleEndReached = () => {
    if (
      hasNextPage &&
      !isFetchingNextPage &&
      !isFetchNextPageError &&
      !isRefetching
    ) {
      void fetchNextPage();
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-black px-6">
        <StatusBar style="light" />
        <ActivityIndicator size="large" color={colors.primary.DEFAULT} />
        <Text className="mt-4 font-golos text-sm text-white/60">
          Carregando seus pedidos…
        </Text>
      </View>
    );
  }

  if (isError && !data) {
    return (
      <View className="flex-1 items-center justify-center bg-black px-6">
        <StatusBar style="light" />
        <Ionicons
          name="alert-circle-outline"
          size={52}
          color={colors.primary.DEFAULT}
        />
        <Text className="mt-4 text-center font-sans text-xl text-white">
          Não foi possível carregar os pedidos
        </Text>
        <Text className="mt-2 text-center font-golos text-sm text-white/60">
          Ocorreu um erro ao buscar o seu histórico.
        </Text>
        <Pressable
          onPress={() => void refetch()}
          accessibilityRole="button"
          accessibilityLabel="Tentar carregar os pedidos novamente"
          className="mt-6 rounded-2xl bg-primary px-6 py-3.5 active:opacity-85"
        >
          <Text className="font-golos-semibold text-sm text-white">
            Tentar novamente
          </Text>
        </Pressable>
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
          <View className="flex-1 items-center justify-center px-6 py-20">
            <View className="h-20 w-20 items-center justify-center rounded-full bg-white/5">
              <Ionicons name="receipt-outline" size={40} color="#777179" />
            </View>
            <Text className="mt-5 text-center font-sans text-xl font-bold text-white">
              Nenhum pedido por aqui
            </Text>
            <Text className="mt-2 text-center font-golos text-sm leading-5 text-white/60">
              Quando você fizer uma compra na Spinova, você poderá acompanhar
              todos os seus pedidos nesta tela.
            </Text>
            <Pressable
              onPress={() => router.replace("/home")}
              accessibilityRole="button"
              accessibilityLabel="Explorar catálogo de produtos"
              className="mt-6 rounded-2xl bg-primary px-7 py-3.5 active:opacity-85"
            >
              <Text className="font-golos-semibold text-sm text-white">
                Explorar catálogo
              </Text>
            </Pressable>
          </View>
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
