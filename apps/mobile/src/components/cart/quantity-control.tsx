import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

type QuantityControlProps = {
  title: string;
  quantity: number;
  decreaseDisabled: boolean;
  increaseDisabled: boolean;
  onDecrease: () => void;
  onIncrease: () => void;
};

export function QuantityControl({
  title,
  quantity,
  decreaseDisabled,
  increaseDisabled,
  onDecrease,
  onIncrease,
}: QuantityControlProps) {
  return (
    <View
      className="h-10 flex-row items-center overflow-hidden rounded-xl px-1"
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.82)",
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.24)",
      }}
      accessibilityRole="adjustable"
      accessibilityLabel={`Quantidade de ${title}`}
      accessibilityValue={{ min: 0, now: quantity }}
    >
      <Pressable
        onPress={onDecrease}
        disabled={decreaseDisabled}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel={`Diminuir quantidade de ${title}`}
        className="h-8 w-8 items-center justify-center rounded-full active:opacity-70 disabled:opacity-40"
        style={{ backgroundColor: "rgba(38, 36, 41, 0.22)" }}
      >
        <Ionicons name="remove" size={18} color="#29282B" />
      </Pressable>

      <Text className="w-12 text-center font-golos text-lg text-[#242326]">
        {quantity}
      </Text>

      <Pressable
        onPress={onIncrease}
        disabled={increaseDisabled}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel={`Aumentar quantidade de ${title}`}
        className="h-8 w-8 items-center justify-center rounded-full active:opacity-70 disabled:opacity-40"
        style={{ backgroundColor: "rgba(38, 36, 41, 0.22)" }}
      >
        <Ionicons name="add" size={18} color="#29282B" />
      </Pressable>
    </View>
  );
}
