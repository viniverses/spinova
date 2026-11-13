import type { Ionicons } from "@expo/vector-icons";
import type { ComponentProps } from "react";

import type { OrderStatus } from "@/services/orders";

type OrderStatusConfig = {
  label: string;
  icon: ComponentProps<typeof Ionicons>["name"];
  iconColor: string;
  bgClass: string;
  textClass: string;
  borderClass: string;
};

const STATUS_CONFIGS: Record<OrderStatus, OrderStatusConfig> = {
  pending: {
    iconColor: "#FBBF24",
    label: "Aguardando pagamento",
    icon: "time-outline",
    bgClass: "bg-amber-500/15",
    textClass: "text-amber-400",
    borderClass: "border-amber-500/30",
  },
  paid: {
    iconColor: "#34D399",
    label: "Pago",
    icon: "checkmark-circle-outline",
    bgClass: "bg-emerald-500/15",
    textClass: "text-emerald-400",
    borderClass: "border-emerald-500/30",
  },
  processing: {
    iconColor: "#60A5FA",
    label: "Em processamento",
    icon: "sync-outline",
    bgClass: "bg-blue-500/15",
    textClass: "text-blue-400",
    borderClass: "border-blue-500/30",
  },
  shipped: {
    iconColor: "#C084FC",
    label: "Enviado",
    icon: "airplane-outline",
    bgClass: "bg-purple-500/15",
    textClass: "text-purple-400",
    borderClass: "border-purple-500/30",
  },
  delivered: {
    iconColor: "#34D399",
    label: "Entregue",
    icon: "cube-outline",
    bgClass: "bg-emerald-500/15",
    textClass: "text-emerald-400",
    borderClass: "border-emerald-500/30",
  },
  cancelled: {
    iconColor: "#FB7185",
    label: "Cancelado",
    icon: "close-circle-outline",
    bgClass: "bg-rose-500/15",
    textClass: "text-rose-400",
    borderClass: "border-rose-500/30",
  },
  refunded: {
    iconColor: "#FBBF24",
    label: "Reembolsado",
    icon: "return-down-back-outline",
    bgClass: "bg-gray-500/15",
    textClass: "text-gray-300",
    borderClass: "border-gray-500/30",
  },
};

export function getOrderStatusConfig(status: OrderStatus): OrderStatusConfig {
  return STATUS_CONFIGS[status] ?? STATUS_CONFIGS.pending;
}
