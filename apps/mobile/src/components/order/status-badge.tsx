import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

import type { OrderStatus } from "@/services/orders";

import { getOrderStatusConfig } from "./status-config";

export function StatusBadge({ status }: { status: OrderStatus }) {
  const config = getOrderStatusConfig(status);

  return (
    <View
      className={`flex-row items-center gap-1.5 rounded-full border px-2.5 py-1 ${config.bgClass} ${config.borderClass}`}
    >
      <Ionicons name={config.icon} size={14} color={config.iconColor} />
      <Text className={`font-golos-semibold text-xs ${config.textClass}`}>
        {config.label}
      </Text>
    </View>
  );
}
