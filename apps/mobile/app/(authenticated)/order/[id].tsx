import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Pressable, ScrollView, Text, View } from "react-native";

import { OrderCardItem } from "@/components/order/order-card-item";
import { StatusBadge } from "@/components/order/status-badge";
import { ErrorState } from "@/components/ui/error-state";
import { LoadingState } from "@/components/ui/loading-state";
import { useOrder } from "@/hooks/use-orders";
import { colors } from "@/lib/theme";
import { formatCurrency, formatDate, formatOrderCode } from "@/utils";

export default function OrderDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: order, isPending, isError, refetch } = useOrder(id ?? "");

  if (id && isPending) {
    return (
      <View className="flex-1 bg-black">
        <StatusBar style="light" />
        <LoadingState message="Carregando pedido…" />
      </View>
    );
  }

  if (!id || isError || !order) {
    return (
      <View className="flex-1 bg-black">
        <StatusBar style="light" />
        <ErrorState
          icon={
            <Ionicons
              name="receipt-outline"
              size={52}
              color={colors.primary.DEFAULT}
            />
          }
          title="Não foi possível carregar o pedido"
          description="Confira sua conexão e tente novamente."
          onRetry={() => void refetch()}
          retryAccessibilityLabel="Tentar carregar o pedido novamente"
        >
          <Pressable
            onPress={() => router.replace("/orders")}
            accessibilityRole="button"
            accessibilityLabel="Ver todos os pedidos"
            className="mt-3 min-h-12 items-center justify-center px-6"
          >
            <Text className="font-golos-semibold text-base text-white">
              Ver todos os pedidos
            </Text>
          </Pressable>
        </ErrorState>
      </View>
    );
  }

  const orderCode = formatOrderCode(order.id);
  const address = order.address;

  return (
    <View className="flex-1 bg-black">
      <StatusBar style="light" />
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 12,
          paddingBottom: 120,
        }}
      >
        <Text className="font-sans text-3xl text-white">Seu pedido</Text>
        <View className="mt-4 flex-row items-center justify-between gap-3 border-b border-white/10 pb-4">
          <View>
            <Text className="font-sans text-base font-bold text-white">
              {orderCode}
            </Text>
            <Text className="mt-0.5 font-golos text-xs text-white/60">
              {formatDate(order.createdAt)}
            </Text>
          </View>

          <StatusBadge status={order.status} />
        </View>

        <Text className="mb-2 mt-6 font-sans text-xl text-white">
          Itens do pedido
        </Text>
        {order.items.map((item) => (
          <OrderCardItem
            key={item.id}
            item={item}
            variant="detail"
            onProductPress={(productId) =>
              router.push({
                pathname: "/product/[id]",
                params: { id: productId },
              })
            }
          />
        ))}

        <Text className="mb-3 mt-8 font-sans text-xl text-white">Entrega</Text>
        <Text className="font-golos text-sm leading-6 text-white/80">
          {address.street}, {address.number}
          {address.complement ? `, ${address.complement}` : ""}
          {"\n"}
          {address.neighborhood ? `${address.neighborhood}, ` : ""}
          {address.city}/{address.state} · {address.zipCode}
        </Text>

        <View className="mt-8 flex-row items-center justify-between border-t border-white/15 pt-4">
          <Text className="font-golos-semibold text-base text-white">
            Total do pedido
          </Text>
          <Text className="font-sans text-xl text-white">
            {formatCurrency(order.total)}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
