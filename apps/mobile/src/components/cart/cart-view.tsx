import { Ionicons } from "@expo/vector-icons";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { colors } from "@/lib/theme";
import type { Cart, CartItem } from "@/services/cart";
import { formatCurrency } from "@/utils";

import { CartItemCard } from "./cart-item-card";
import { CartSummary } from "./cart-summary";
import { RemoveCartItemModal } from "./remove-cart-item-modal";

const TAB_BAR_CLEARANCE = 118;

type CartViewProps = {
  isLoading: boolean;
  isLoadError: boolean;
  retry: () => void;
  items: {
    item: CartItem;
    decreaseDisabled: boolean;
    increaseDisabled: boolean;
  }[];
  totals: Pick<Cart, "subtotal" | "shipping" | "total">;
  isUpdating: boolean;
  hasUpdateError: boolean;
  dismissUpdateError: () => void;
  changeQuantity: (item: CartItem, direction: "decrease" | "increase") => void;
  pendingRemoval: { title: string } | null;
  cancelRemoval: () => void;
  confirmRemoval: () => void;
  onBack: () => void;
  onExplore: () => void;
  onProductPress: (productId: string) => void;
  onCheckout: () => void;
};

export function CartView({
  isLoading,
  isLoadError,
  retry,
  items,
  totals,
  isUpdating,
  hasUpdateError,
  dismissUpdateError,
  changeQuantity,
  pendingRemoval,
  cancelRemoval,
  confirmRemoval,
  onBack,
  onExplore,
  onProductPress,
  onCheckout,
}: CartViewProps) {
  const { width } = useWindowDimensions();
  const compact = width < 370;

  return (
    <View className="flex-1 bg-[#151315]">
      <SafeAreaView className="flex-1" edges={["top", "left", "right"]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: compact ? 16 : 23,
            paddingBottom: TAB_BAR_CLEARANCE,
          }}
        >
          <Pressable
            onPress={onBack}
            accessibilityRole="button"
            accessibilityLabel="Voltar"
            className="mt-6 h-14 w-14 items-center justify-center rounded-xl bg-[#272628] active:opacity-75"
          >
            <Ionicons name="chevron-back" size={24} color="#D5D4D7" />
          </Pressable>

          <Text className="mb-3 mt-8 font-sans text-[28px] leading-9 text-[#F7F6F7]">
            Carrinho
          </Text>

          {isLoading ? (
            <View className="flex-1 items-center justify-center pb-28 pt-16">
              <ActivityIndicator color={colors.primary.DEFAULT} size="large" />
              <Text className="mt-4 font-golos text-sm text-white/65">
                Carregando seu carrinho…
              </Text>
            </View>
          ) : isLoadError ? (
            <View className="flex-1 items-center justify-center px-5 pb-28 pt-12">
              <Ionicons
                name="cloud-offline-outline"
                size={48}
                color="#777179"
              />
              <Text className="mt-5 text-center font-sans text-xl text-white">
                Seu carrinho não carregou
              </Text>
              <Text className="mt-2 text-center font-golos text-sm leading-5 text-white/60">
                Verifique sua conexão e tente novamente.
              </Text>
              <Pressable
                onPress={() => void retry()}
                accessibilityRole="button"
                className="mt-6 min-h-12 items-center justify-center rounded-xl bg-primary px-6 active:opacity-80"
              >
                <Text className="font-golos-semibold text-sm text-white">
                  Tentar novamente
                </Text>
              </Pressable>
            </View>
          ) : items.length === 0 ? (
            <View className="flex-1 items-center justify-center px-5 pb-28 pt-12">
              <Ionicons name="cart-outline" size={52} color="#777179" />
              <Text className="mt-5 text-center font-sans text-xl text-white">
                Seu carrinho está vazio
              </Text>
              <Text className="mt-2 max-w-72 text-center font-golos text-sm leading-5 text-white/60">
                Adicione um disco para encontrá-lo aqui.
              </Text>
              <Pressable
                onPress={onExplore}
                accessibilityRole="button"
                className="mt-6 min-h-12 items-center justify-center rounded-xl bg-primary px-6 active:opacity-80"
              >
                <Text className="font-golos-semibold text-sm text-white">
                  Explorar discos
                </Text>
              </Pressable>
            </View>
          ) : (
            <>
              <View className="gap-2.5">
                {items.map(({ item, decreaseDisabled, increaseDisabled }) => (
                  <CartItemCard
                    key={item.id}
                    item={item}
                    compact={compact}
                    decreaseDisabled={decreaseDisabled}
                    increaseDisabled={increaseDisabled}
                    onPress={() => onProductPress(item.product.id)}
                    onDecrease={() => changeQuantity(item, "decrease")}
                    onIncrease={() => changeQuantity(item, "increase")}
                  />
                ))}
              </View>

              {hasUpdateError ? (
                <Pressable
                  onPress={dismissUpdateError}
                  accessibilityRole="alert"
                  className="mt-3 rounded-xl bg-[#34272A] px-4 py-3 active:opacity-80"
                >
                  <Text className="font-golos text-sm text-[#FFB1AD]">
                    Não foi possível atualizar a quantidade. Toque para fechar e
                    tente novamente.
                  </Text>
                </Pressable>
              ) : null}

              <CartSummary totals={totals} />

              <Pressable
                onPress={onCheckout}
                disabled={isUpdating}
                accessibilityRole="button"
                accessibilityLabel={`Continuar para o checkout, total ${formatCurrency(totals.total)}`}
                accessibilityState={{ disabled: isUpdating }}
                className="mt-3 min-h-[50px] flex-row items-center justify-center gap-2 rounded-[11px] bg-primary px-5 active:opacity-85 disabled:bg-[#4D474E]"
              >
                <Text className="font-sans text-xl text-white">Check-out</Text>
                <Ionicons name="arrow-forward" size={24} color="#FFFFFF" />
              </Pressable>
            </>
          )}
        </ScrollView>
      </SafeAreaView>

      <RemoveCartItemModal
        visible={pendingRemoval !== null}
        title={pendingRemoval?.title}
        onCancel={cancelRemoval}
        onConfirm={confirmRemoval}
      />
    </View>
  );
}
