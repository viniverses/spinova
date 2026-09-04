import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import type { ComponentProps } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { isAxiosError } from "axios";
import { SafeAreaView } from "react-native-safe-area-context";

import { useCart } from "@/hooks/use-cart";
import { useDefaultAddress } from "@/hooks/use-addresses";
import { useCompleteCheckout } from "@/hooks/use-orders";

const SHIPPING = 15;
const CONTENT_BOTTOM_PADDING = 24;

const formatCurrency = (value: number) =>
  `R$${value.toFixed(2).replace(".", ",")}`;

type CheckoutDetailProps = {
  title: string;
  icon: ComponentProps<typeof Ionicons>["name"];
  actionIcon?: ComponentProps<typeof Ionicons>["name"];
  lines: string[];
  onEdit: () => void;
};

function CheckoutDetail({
  title,
  icon,
  actionIcon = "create-outline",
  lines,
  onEdit,
}: CheckoutDetailProps) {
  return (
    <View className="flex-row items-center">
      <View className="h-[104px] w-[104px] shrink-0 items-center justify-center rounded-xl bg-[#272628]">
        <Ionicons name={icon} size={52} color="#F7F6F7" />
      </View>

      <View className="ml-3.5 min-w-0 flex-1 self-stretch justify-center">
        <Text
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.76}
          className="font-sans text-[22px] leading-7 text-[#F7F6F7]"
        >
          {title}
        </Text>
        <View className="mt-1">
          {lines.map((line) => (
            <Text
              key={line}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.82}
              className="font-golos text-[15px] leading-5 text-[#EFEDEF]"
            >
              {line}
            </Text>
          ))}
        </View>
      </View>

      <Pressable
        onPress={onEdit}
        accessibilityRole="button"
        accessibilityLabel={`Editar ${title.toLowerCase()}`}
        hitSlop={8}
        className="h-12 w-12 shrink-0 items-center justify-center rounded-full active:bg-white/10"
      >
        <Ionicons name={actionIcon} size={25} color="#F7F6F7" />
      </Pressable>
    </View>
  );
}

export default function CheckoutScreen() {
  const router = useRouter();
  const cart = useCart();
  const defaultAddress = useDefaultAddress();
  const completeCheckout = useCompleteCheckout();

  const address = defaultAddress.data;
  const hasAddress = Boolean(address);
  const subtotal = Number(cart.data?.subtotal ?? 0);
  const total = subtotal + SHIPPING;

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
              } as never),
          },
        ],
      );
      return;
    }

    completeCheckout.mutate(undefined, {
      onSuccess: (order) => {
        router.replace({
          pathname: "/order-complete",
          params: { total: formatCurrency(Number(order.total)) },
        } as never);
      },
      onError: (error: unknown) => {
        const message =
          isAxiosError<{ error?: { message?: string } }>(error) &&
          error.response?.data?.error?.message
            ? error.response.data.error.message
            : "Confira seu carrinho e endereço de entrega, depois tente novamente.";

        Alert.alert("Não foi possível concluir a compra", message);
      },
    });
  };

  const addressLines = defaultAddress.isLoading
    ? ["Carregando endereço..."]
    : address
      ? [
          `${address.street}, ${address.number}${address.complement ? ` - ${address.complement}` : ""}`,
          address.neighborhood
            ? `${address.neighborhood}, ${address.city} - ${address.state}`
            : `${address.city} - ${address.state}`,
        ]
      : ["Nenhum endereço cadastrado", "Toque para adicionar um endereço"];

  return (
    <View className="flex-1 bg-[#151315]">
      <SafeAreaView className="flex-1" edges={["top", "bottom", "left", "right"]}>
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
              lines={["(11) 1234-5678", "contato@spinova.com.br"]}
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
                  } as never);
                } else {
                  router.push({
                    pathname: "/address",
                    params: { returnTo: "/checkout" },
                  } as never);
                }
              }}
            />

            <CheckoutDetail
              title="Forma de Pagamento"
              icon="card"
              lines={["Visa", "•••• 1659", "3x sem juros"]}
              onEdit={() => showEditNotice("forma de pagamento")}
            />
          </View>

          <View className="mt-8 gap-1">
            <View className="flex-row items-center justify-between">
              <Text className="font-golos text-[17px] text-[#F2F0F2]">
                Subtotal
              </Text>
              <Text className="font-golos text-[17px] text-[#F2F0F2]">
                {formatCurrency(subtotal)}
              </Text>
            </View>
            <View className="flex-row items-center justify-between">
              <Text className="font-golos text-[17px] text-[#F2F0F2]">
                Frete
              </Text>
              <Text className="font-golos text-[17px] text-[#F2F0F2]">
                {formatCurrency(SHIPPING)}
              </Text>
            </View>
            <View className="flex-row items-center justify-between">
              <Text className="font-golos text-[17px] text-[#F2F0F2]">
                Total
              </Text>
              <Text className="font-golos text-[17px] text-[#F2F0F2]">
                {formatCurrency(total)}
              </Text>
            </View>
          </View>

          {!hasAddress && !defaultAddress.isLoading ? (
            <Pressable
              onPress={() =>
                router.push({
                  pathname: "/address",
                  params: { returnTo: "/checkout" },
                } as never)
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
            accessibilityLabel={`Finalizar compra, total ${formatCurrency(total)}`}
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
                ? "Finalizando compra"
                : "Finalizar compra"}
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
