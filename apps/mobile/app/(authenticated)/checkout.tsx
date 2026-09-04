import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import type { ComponentProps } from "react";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useCart } from "@/hooks/use-cart";

const SHIPPING = 15;
const TAB_BAR_CLEARANCE = 132;

const formatCurrency = (value: number) =>
  `R$${value.toFixed(2).replace(".", ",")}`;

type CheckoutDetailProps = {
  title: string;
  icon: ComponentProps<typeof Ionicons>["name"];
  lines: string[];
  onEdit: () => void;
};

function CheckoutDetail({ title, icon, lines, onEdit }: CheckoutDetailProps) {
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
        <Ionicons name="create-outline" size={25} color="#F7F6F7" />
      </Pressable>
    </View>
  );
}

export default function CheckoutScreen() {
  const router = useRouter();
  const cart = useCart();
  const subtotal = Number(cart.data?.subtotal ?? 374.7);
  const total = subtotal + SHIPPING;

  const showEditNotice = (section: string) => {
    Alert.alert(`Editar ${section}`, "Não disponível");
  };

  const handleFinishPurchase = () => {
    Alert.alert(
      "Confirmar compra",
      `O total do pedido é ${formatCurrency(total)}. A integração de pagamento ainda não está disponível.`,
    );
  };

  return (
    <View className="flex-1 bg-[#151315]">
      <SafeAreaView className="flex-1" edges={["top", "left", "right"]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 23,
            paddingBottom: TAB_BAR_CLEARANCE,
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
              lines={["Rua dos Discos, 12", "República", "São Paulo - SP"]}
              onEdit={() => showEditNotice("endereço de entrega")}
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

          <Pressable
            onPress={handleFinishPurchase}
            accessibilityRole="button"
            accessibilityLabel={`Finalizar compra, total ${formatCurrency(total)}`}
            className="mt-7 min-h-[50px] flex-row items-center justify-center gap-2 rounded-[11px] bg-primary px-5 active:opacity-85"
          >
            <Text
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.78}
              className="font-sans text-xl text-white"
            >
              Finalizar compra
            </Text>
            <Ionicons name="arrow-forward" size={24} color="#FFFFFF" />
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
