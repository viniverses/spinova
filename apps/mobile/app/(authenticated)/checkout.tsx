import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { CartSummary } from "@/components/cart/cart-summary";
import { CheckoutDetail } from "@/components/checkout/checkout-detail";
import { useCart } from "@/hooks/use-cart";
import { useDefaultAddress } from "@/hooks/use-addresses";
import { useCompleteCheckout } from "@/hooks/use-orders";
import {
  formatAddressLines,
  formatCurrency,
  getApiErrorMessage,
} from "@/utils";

const CONTENT_BOTTOM_PADDING = 24;

export default function CheckoutScreen() {
  const router = useRouter();
  const cart = useCart();
  const defaultAddress = useDefaultAddress();
  const completeCheckout = useCompleteCheckout();

  const address = defaultAddress.data;
  const hasAddress = Boolean(address);
  const subtotal = cart.data?.subtotal ?? "0.00";
  const shipping = cart.data?.shipping ?? "0.00";
  const total = cart.data?.total ?? "0.00";

  const showEditNotice = (section: string) => {
    Alert.alert(`Editar ${section}`, "Não disponível");
  };

  const handleFinishPurchase = () => {
    if (!hasAddress) {
      Alert.alert(
        "Endereço de entrega necessário",
        "Cadastre um endereço para poder finalizar a compra.",
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Cadastrar",
            onPress: () =>
              router.push({
                pathname: "/address",
                params: { returnTo: "/checkout" },
              }),
          },
        ],
      );
      return;
    }

    completeCheckout.mutate(undefined, {
      onSuccess: (order) => {
        router.replace({
          pathname: "/order-complete",
          params: {
            orderId: order.id,
            total: formatCurrency(Number(order.total)),
          },
        });
      },
      onError: (error: unknown) => {
        const message = getApiErrorMessage(
          error,
          "Confira seu carrinho e endereço de entrega, depois tente novamente.",
        );

        Alert.alert("Não foi possível criar o pedido", message);
      },
    });
  };

  const addressLines = defaultAddress.isLoading
    ? ["Carregando endereço..."]
    : address
      ? formatAddressLines(address)
      : ["Nenhum endereço cadastrado", "Toque para adicionar um endereço"];

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
              onEdit={() => showEditNotice("contato")}
            />

            <CheckoutDetail
              title="Endereço de entrega"
              icon="location"
              actionIcon={hasAddress ? "create-outline" : "add-circle-outline"}
              lines={addressLines}
              onEdit={() => {
                if (address) {
                  router.push({
                    pathname: "/address",
                    params: { id: address.id, returnTo: "/checkout" },
                  });
                } else {
                  router.push({
                    pathname: "/address",
                    params: { returnTo: "/checkout" },
                  });
                }
              }}
            />

            <CheckoutDetail
              title="Forma de Pagamento"
              icon="card"
              lines={[
                "Cartão de demonstração",
                "Nenhuma cobrança será realizada",
              ]}
              onEdit={() => showEditNotice("forma de pagamento")}
            />
          </View>

          <CartSummary
            totals={{ subtotal, shipping, total }}
            className="mt-8 gap-1"
          />

          {!hasAddress && !defaultAddress.isLoading ? (
            <Pressable
              onPress={() =>
                router.push({
                  pathname: "/address",
                  params: { returnTo: "/checkout" },
                })
              }
              className="mt-6 rounded-xl border border-primary/30 bg-primary/10 p-3.5"
            >
              <Text className="text-center font-golos text-sm text-primary">
                Cadastre um endereço de entrega para finalizar a compra
              </Text>
            </Pressable>
          ) : null}

          <Pressable
            onPress={handleFinishPurchase}
            disabled={
              completeCheckout.isPending ||
              cart.isPending ||
              !cart.data?.items.length
            }
            accessibilityRole="button"
            accessibilityLabel={`Confirmar pedido, total ${formatCurrency(total)}`}
            accessibilityState={{
              disabled:
                completeCheckout.isPending ||
                cart.isPending ||
                !cart.data?.items.length,
              busy: completeCheckout.isPending,
            }}
            className="mt-7 min-h-[50px] flex-row items-center justify-center gap-2 rounded-[11px] bg-primary px-5 active:opacity-85 disabled:bg-[#4D474E]"
          >
            <Text
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.78}
              className="font-sans text-xl text-white"
            >
              {completeCheckout.isPending
                ? "Criando pedido"
                : "Confirmar pedido"}
            </Text>
            {completeCheckout.isPending ? (
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
