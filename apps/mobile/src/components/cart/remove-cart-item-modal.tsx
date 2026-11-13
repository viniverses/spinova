import { Ionicons } from "@expo/vector-icons";
import { Modal, Pressable, Text, View } from "react-native";

import { colors } from "@/lib/theme";

type RemoveCartItemModalProps = {
  visible: boolean;
  title?: string;
  onCancel: () => void;
  onConfirm: () => void;
};

export function RemoveCartItemModal({
  visible,
  title,
  onCancel,
  onConfirm,
}: RemoveCartItemModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onCancel}
    >
      <View className="flex-1 items-center justify-center bg-black/75 px-6">
        <View
          className="w-full max-w-sm rounded-2xl bg-[#2A282B] p-5"
          accessibilityViewIsModal
        >
          <View className="h-11 w-11 items-center justify-center rounded-full bg-primary/15">
            <Ionicons
              name="trash-outline"
              size={23}
              color={colors.primary.DEFAULT}
            />
          </View>

          <Text className="mt-4 font-sans text-xl text-white">
            Remover do carrinho?
          </Text>
          <Text className="mt-2 font-golos text-sm leading-5 text-white/65">
            {title
              ? `${title} será removido do seu carrinho.`
              : "Este item será removido do seu carrinho."}
          </Text>

          <View className="mt-6 flex-row gap-3">
            <Pressable
              onPress={onCancel}
              accessibilityRole="button"
              accessibilityLabel="Cancelar remoção"
              className="min-h-12 flex-1 items-center justify-center rounded-xl bg-white/10 px-4 active:opacity-70"
            >
              <Text className="font-golos-semibold text-sm text-white">
                Cancelar
              </Text>
            </Pressable>
            <Pressable
              onPress={onConfirm}
              accessibilityRole="button"
              accessibilityLabel={`Remover ${title ?? "item"} do carrinho`}
              className="min-h-12 flex-1 items-center justify-center rounded-xl bg-primary px-4 active:opacity-80"
            >
              <Text className="font-golos-semibold text-sm text-white">
                Remover
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
