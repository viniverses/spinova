import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

import type { Order } from "@/services/orders";
import { formatDate, formatCurrency } from "@/utils";

import { OrderCardItem } from "./order-card-item";
import { StatusBadge } from "./status-badge";

type OrderCardProps = {
  order: Order;
  onOrderPress: (orderId: string) => void;
  onProductPress: (productId: string) => void;
};

export function OrderCard({
  order,
  onOrderPress,
  onProductPress,
}: OrderCardProps) {
  const orderCode = `#${order.id.slice(0, 8).toUpperCase()}`;

  return (
    <View className="mb-4 rounded-3xl border border-white/10 bg-[#161418] p-4">
      {/* Header do Card */}
      <View className="flex-row items-center justify-between border-b border-white/10 pb-3">
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

      {/* Itens do Pedido */}
      <View className="divide-y divide-white/5 py-1">
        {order.items.map((item) => (
          <OrderCardItem
            key={item.id}
            item={item}
            onProductPress={onProductPress}
          />
        ))}
      </View>

      {/* Endereço e Rodapé */}
      <View className="mt-2 border-t border-white/10 pt-3">
        <View className="flex-row items-start gap-2">
          <Ionicons
            name="location-outline"
            size={16}
            color="#A1A1AA"
            className="mt-0.5"
          />
          <Text
            numberOfLines={1}
            className="flex-1 font-golos text-xs text-white/60"
          >
            {order.address.street}, {order.address.number} •{" "}
            {order.address.city}/{order.address.state}
          </Text>
        </View>

        <View className="mt-3 flex-row items-center justify-between">
          <Text className="font-golos text-sm text-white/70">
            Total do pedido
          </Text>
          <Text className="font-sans text-lg font-bold text-white">
            {formatCurrency(order.total)}
          </Text>
        </View>

        <Pressable
          onPress={() => onOrderPress(order.id)}
          accessibilityRole="button"
          accessibilityLabel={`Visualizar pedido ${orderCode}`}
          className="mt-4 min-h-12 flex-row items-center justify-center gap-2 rounded-xl border border-white/20 active:bg-white/10"
        >
          <Text className="font-golos-semibold text-sm text-white">
            Visualizar pedido
          </Text>
          <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
        </Pressable>
      </View>
    </View>
  );
}
