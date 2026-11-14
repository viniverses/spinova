import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { CartSummary } from "@/components/cart/cart-summary";
import { CheckoutDetail } from "@/components/checkout/checkout-detail";
import { useCheckoutFlow } from "@/hooks/use-checkout-flow";
import { formatCurrency } from "@/utils";

const CONTENT_BOTTOM_PADDING = 24;

export default function CheckoutScreen() {
  const router = useRouter();

  const checkout = useCheckoutFlow({
    onNavigateToAddress: (addressId) =>
      router.push({
        pathname: "/address",
        params: addressId
          ? { id: addressId, returnTo: "/checkout" }
          : { returnTo: "/checkout" },
      }),
    onOrderComplete: (params) =>
      router.replace({
        pathname: "/order-complete",
        params,
      }),
  });

  return (
    <View className="flex-1 bg-[#151315]">
      <SafeAreaView
        className="flex-1"
        edges={["top", "bottom", "left", "right"]}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 23,
            paddingBottom: CONTENT_BOTTOM_PADDING,
          }}
        >
          <Pressable
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="Voltar ao carrinho"
            className="mt-6 h-14 w-14 items-center justify-center rounded-xl bg-[#272628] active:opacity-75"
          >
            <Ionicons name="chevron-back" size={24} color="#D5D4D7" />
          </Pressable>

          <Text className="mb-7 mt-8 font-sans text-[28px] leading-9 text-[#F7F6F7]">
            Check-out
          </Text>

          <View className="gap-7">
            <CheckoutDetail
              title="Contato"
              icon="call"
              lines={["Telefone de demonstração", "E-mail de demonstração"]}
              onEdit={() => checkout.showEditNotice("contato")}
            />

            <CheckoutDetail
              title="Endereço de entrega"
              icon="location"
              actionIcon={
                checkout.hasAddress ? "create-outline" : "add-circle-outline"
              }
              lines={checkout.addressLines}
              onEdit={checkout.openAddress}
            />

            <CheckoutDetail
              title="Forma de Pagamento"
              icon="card"
              lines={[
                "Cartão de demonstração",
                "Nenhuma cobrança será realizada",
              ]}
              onEdit={() => checkout.showEditNotice("forma de pagamento")}
            />
          </View>

          <CartSummary totals={checkout.totals} className="mt-8 gap-1" />

          {!checkout.hasAddress && !checkout.isAddressLoading ? (
            <Pressable
              onPress={checkout.openAddress}
              className="mt-6 rounded-xl border border-primary/30 bg-primary/10 p-3.5"
            >
              <Text className="text-center font-golos text-sm text-primary">
                Cadastre um endereço de entrega para finalizar a compra
              </Text>
            </Pressable>
          ) : null}

          <Pressable
            onPress={checkout.finishPurchase}
            disabled={checkout.isConfirmDisabled}
            accessibilityRole="button"
            accessibilityLabel={`Confirmar pedido, total ${formatCurrency(checkout.totals.total)}`}
            accessibilityState={{
              disabled: checkout.isConfirmDisabled,
              busy: checkout.isSubmitting,
            }}
            className="mt-7 min-h-[50px] flex-row items-center justify-center gap-2 rounded-[11px] bg-primary px-5 active:opacity-85 disabled:bg-[#4D474E]"
          >
            <Text
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.78}
              className="font-sans text-xl text-white"
            >
              {checkout.isSubmitting ? "Criando pedido" : "Confirmar pedido"}
            </Text>
            {checkout.isSubmitting ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Ionicons name="arrow-forward" size={24} color="#FFFFFF" />
            )}
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
