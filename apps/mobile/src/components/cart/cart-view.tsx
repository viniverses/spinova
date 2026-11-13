import { Ionicons } from "@expo/vector-icons";
import {
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { LoadingState } from "@/components/ui/loading-state";
import { SafeAreaView } from "react-native-safe-area-context";

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
            <LoadingState
              className="pb-28 pt-16"
              message="Carregando seu carrinho…"
            />
          ) : isLoadError ? (
            <ErrorState
              className="pb-28 pt-12"
              icon={
                <Ionicons
                  name="cloud-offline-outline"
                  size={48}
                  color="#777179"
                />
              }
              title="Seu carrinho não carregou"
              description="Verifique sua conexão e tente novamente."
              onRetry={retry}
            />
          ) : items.length === 0 ? (
            <EmptyState
              className="pb-28 pt-12"
              icon={<Ionicons name="cart-outline" size={52} color="#777179" />}
              title="Seu carrinho está vazio"
              description="Adicione um disco para encontrá-lo aqui."
              action={{ label: "Explorar discos", onPress: onExplore }}
            />
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
