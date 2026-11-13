import { Text, View } from "react-native";

import type { Cart } from "@/services/cart";
import { formatCurrency } from "@/utils";

type CartSummaryProps = {
  className?: string;
  totals: Pick<Cart, "subtotal" | "shipping" | "total">;
};

export function CartSummary({
  totals,
  className = "mt-6 gap-1",
}: CartSummaryProps) {
  return (
    <View className={className}>
      <View className="flex-row items-center justify-between">
        <Text className="font-golos text-[17px] text-[#F2F0F2]">Subtotal</Text>
        <Text className="font-golos text-[17px] text-[#F2F0F2]">
          {formatCurrency(totals.subtotal)}
        </Text>
      </View>

      <View className="flex-row items-center justify-between">
        <Text className="font-golos text-[17px] text-[#F2F0F2]">Frete</Text>
        <Text className="font-golos text-[17px] text-[#F2F0F2]">
          {formatCurrency(totals.shipping)}
        </Text>
      </View>

      <View className="flex-row items-center justify-between">
        <Text className="font-golos text-[17px] text-[#F2F0F2]">Total</Text>
        <Text className="font-golos text-[17px] text-[#F2F0F2]">
          {formatCurrency(totals.total)}
        </Text>
      </View>
    </View>
  );
}
