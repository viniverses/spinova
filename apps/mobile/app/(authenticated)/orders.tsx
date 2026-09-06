import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import type { ComponentProps } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  View,
} from "react-native";

import { useOrders } from "@/hooks/use-orders";
import { colors } from "@/lib/theme";
import type { Order, OrderItem, OrderStatus } from "@/services/orders";
import { formatDate, formatCurrency, formatProductFormat } from "@/utils";

type StatusConfig = {
  label: string;
  icon: ComponentProps<typeof Ionicons>["name"];
  bgClass: string;
  textClass: string;
  borderClass: string;
};

const STATUS_CONFIGS: Record<OrderStatus, StatusConfig> = {
  pending: {
    label: "Aguardando pagamento",
    icon: "time-outline",
    bgClass: "bg-amber-500/15",
    textClass: "text-amber-400",
    borderClass: "border-amber-500/30",
  },
  paid: {
    label: "Pago",
    icon: "checkmark-circle-outline",
    bgClass: "bg-emerald-500/15",
    textClass: "text-emerald-400",
    borderClass: "border-emerald-500/30",
  },
  processing: {
    label: "Em processamento",
    icon: "sync-outline",
    bgClass: "bg-blue-500/15",
    textClass: "text-blue-400",
    borderClass: "border-blue-500/30",
  },
  shipped: {
    label: "Enviado",
    icon: "airplane-outline",
    bgClass: "bg-purple-500/15",
    textClass: "text-purple-400",
    borderClass: "border-purple-500/30",
  },
  delivered: {
    label: "Entregue",
    icon: "cube-outline",
    bgClass: "bg-emerald-500/15",
    textClass: "text-emerald-400",
    borderClass: "border-emerald-500/30",
  },
  cancelled: {
    label: "Cancelado",
    icon: "close-circle-outline",
    bgClass: "bg-rose-500/15",
    textClass: "text-rose-400",
    borderClass: "border-rose-500/30",
  },
  refunded: {
    label: "Reembolsado",
    icon: "return-down-back-outline",
    bgClass: "bg-gray-500/15",
    textClass: "text-gray-300",
    borderClass: "border-gray-500/30",
  },
};

function StatusBadge({ status }: { status: OrderStatus }) {
  const config = STATUS_CONFIGS[status] ?? STATUS_CONFIGS.pending;

  return (
    <View
      className={`flex-row items-center gap-1.5 rounded-full border px-2.5 py-1 ${config.bgClass} ${config.borderClass}`}
    >
      <Ionicons
        name={config.icon}
        size={14}
        color={
          status === "paid" || status === "delivered"
            ? "#34D399"
            : status === "processing"
              ? "#60A5FA"
              : status === "shipped"
                ? "#C084FC"
                : status === "cancelled"
                  ? "#FB7185"
                  : "#FBBF24"
        }
      />
      <Text className={`font-golos-semibold text-xs ${config.textClass}`}>
        {config.label}
      </Text>
    </View>
  );
}

function OrderCardItem({ item }: { item: OrderItem }) {
  const router = useRouter();

  const handleProductPress = () => {
    router.push(`/product/${item.productId}` as never);
  };

  return (
    <Pressable
      onPress={handleProductPress}
      accessibilityRole="button"
      accessibilityLabel={`Ver produto ${item.product.title}`}
      className="flex-row items-center gap-3 py-2.5 active:opacity-80"
    >
      <View className="h-14 w-14 overflow-hidden rounded-xl bg-[#242126]">
        {item.product.image ? (
          <Image
            source={item.product.image.url}
            accessibilityLabel={
              item.product.image.altText ?? item.product.title
            }
            contentFit="cover"
            style={{ width: "100%", height: "100%" }}
            transition={150}
          />
        ) : (
          <View className="flex-1 items-center justify-center">
            <Ionicons name="disc-outline" size={24} color="#777179" />
          </View>
        )}
      </View>

      <View className="flex-1">
        <Text
          numberOfLines={1}
          className="font-sans text-sm font-semibold text-white"
        >
          {item.product.title}
        </Text>
        <Text numberOfLines={1} className="font-golos text-xs text-white/60">
          {item.product.artist.name}
        </Text>
        <View className="mt-1 flex-row items-center gap-2">
          <View className="rounded bg-white/10 px-1.5 py-0.5">
            <Text className="font-golos text-[10px] text-white/80">
              {formatProductFormat(item.product.format)}
            </Text>
          </View>
          <Text className="font-golos text-xs text-white/50">
            Qtd: {item.quantity}
          </Text>
        </View>
      </View>

      <Text className="font-golos-semibold text-sm text-white">
        {formatCurrency(item.unitPrice)}
      </Text>
    </Pressable>
  );
}

function OrderCard({ order }: { order: Order }) {
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
          <OrderCardItem key={item.id} item={item} />
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
      </View>
    </View>
  );
}

export default function OrdersScreen() {
  const router = useRouter();
  const { data, isLoading, isError, refetch, isRefetching } = useOrders();
  const orders = data?.data ?? [];

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

  if (isError) {
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
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 8,
          paddingBottom: 116,
          flexGrow: 1,
        }}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
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
              {orders.length === 0
                ? "Nenhum pedido realizado até o momento"
                : `${orders.length} ${orders.length === 1 ? "pedido realizado" : "pedidos realizados"}`}
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
        renderItem={({ item }) => <OrderCard order={item} />}
      />
    </View>
  );
}
