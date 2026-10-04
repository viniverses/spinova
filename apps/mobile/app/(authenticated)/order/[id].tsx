import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

import { useOrder } from "@/hooks/use-orders";
import { colors } from "@/lib/theme";
import type { OrderStatus } from "@/services/orders";
import { formatCurrency, formatDate, formatProductFormat } from "@/utils";

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Aguardando pagamento",
  paid: "Pago",
  processing: "Em processamento",
  shipped: "Enviado",
  delivered: "Entregue",
  cancelled: "Cancelado",
  refunded: "Reembolsado",
};

export default function OrderDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: order, isPending, isError, refetch } = useOrder(id ?? "");

  if (id && isPending) {
    return (
      <View className="flex-1 items-center justify-center bg-black px-6">
        <StatusBar style="light" />
        <ActivityIndicator size="large" color={colors.primary.DEFAULT} />
        <Text className="mt-4 font-golos text-sm text-white/70">
          Carregando pedido…
        </Text>
      </View>
    );
  }

  if (!id || isError || !order) {
    return (
      <View className="flex-1 items-center justify-center bg-black px-6">
        <StatusBar style="light" />
        <Ionicons
          name="receipt-outline"
          size={52}
          color={colors.primary.DEFAULT}
        />
        <Text className="mt-4 text-center font-sans text-xl text-white">
          Não foi possível carregar o pedido
        </Text>
        <Text className="mt-2 text-center font-golos text-sm text-white/70">
          Confira sua conexão e tente novamente.
        </Text>
        <Pressable
          onPress={() => void refetch()}
          accessibilityRole="button"
          accessibilityLabel="Tentar carregar o pedido novamente"
          className="mt-6 min-h-12 items-center justify-center rounded-xl bg-primary px-6 active:opacity-85"
        >
          <Text className="font-golos-semibold text-base text-white">
            Tentar novamente
          </Text>
        </Pressable>
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
      </View>
    );
  }

  const orderCode = `#${order.id.slice(0, 8).toUpperCase()}`;
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
        <Text className="mt-2 font-golos text-sm text-white/70">
          {orderCode} · {formatDate(order.createdAt)}
        </Text>

        <View className="mt-6 flex-row items-center gap-2 rounded-xl bg-[#242126] px-4 py-3">
          <Ionicons
            name="receipt-outline"
            size={22}
            color={colors.primary.DEFAULT}
          />
          <Text className="flex-1 font-golos-semibold text-sm text-white">
            {STATUS_LABELS[order.status] ?? STATUS_LABELS.pending}
          </Text>
        </View>

        <Text className="mb-2 mt-8 font-sans text-xl text-white">
          Itens do pedido
        </Text>
        {order.items.map((item) => (
          <View
            key={item.id}
            className="flex-row items-center gap-3 border-b border-white/10 py-4"
          >
            <View className="h-16 w-16 overflow-hidden rounded-xl bg-[#242126]">
              {item.product.image ? (
                <Image
                  source={item.product.image.url}
                  contentFit="cover"
                  accessibilityLabel={
                    item.product.image.altText ?? item.product.title
                  }
                  style={{ width: "100%", height: "100%" }}
                />
              ) : (
                <View className="flex-1 items-center justify-center">
                  <Ionicons name="disc-outline" size={26} color="#777179" />
                </View>
              )}
            </View>
            <View className="min-w-0 flex-1">
              <Text className="font-sans text-base text-white">
                {item.product.title}
              </Text>
              <Text className="mt-0.5 font-golos text-sm text-white/70">
                {item.product.artist.name}
              </Text>
              <Text className="mt-1 font-golos text-xs text-white/70">
                {formatProductFormat(item.product.format)} · Qtd: {item.quantity}
              </Text>
              <Text className="mt-1 font-golos-semibold text-sm text-white">
                {formatCurrency(Number(item.unitPrice) * item.quantity)}
              </Text>
            </View>
          </View>
        ))}

        <Text className="mb-3 mt-8 font-sans text-xl text-white">
          Entrega
        </Text>
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
