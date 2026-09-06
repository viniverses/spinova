import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import type { ComponentProps } from "react";
import { useMemo } from "react";
import { Alert, Pressable, Text, View } from "react-native";

import { useHelp } from "@/providers/help-provider";

type ProfileAction = {
  id: string;
  label: string;
  icon: ComponentProps<typeof Ionicons>["name"];
  onPress: () => void;
};

export const ProfileActionsMenu = () => {
  const router = useRouter();
  const { openHelp } = useHelp();

  const profileActions: ProfileAction[] = useMemo(
    () => [
      {
        id: "orders",
        label: "Seus pedidos",
        icon: "checkmark-circle-outline",
        onPress: () => router.push("/orders" as never),
      },
      {
        id: "address",
        label: "Endereço de entrega",
        icon: "location-outline",
        onPress: () =>
          router.push({
            pathname: "/address",
            params: { returnTo: "/profile" },
          } as never),
      },
      {
        id: "account",
        label: "Sua conta",
        icon: "person-outline",
        onPress: () =>
          Alert.alert(
            "Em breve",
            "A edição de perfil estará disponível em breve.",
          ),
      },
      {
        id: "wishlist",
        label: "Lista de desejos",
        icon: "heart-outline",
        onPress: () => router.push("/wishlist" as never),
      },
      {
        id: "coupons",
        label: "Cupons",
        icon: "ticket-outline",
        onPress: () =>
          Alert.alert(
            "Em breve",
            "A carteira de cupons estará disponível em breve.",
          ),
      },
      {
        id: "giftcards",
        label: "Vale-presente",
        icon: "gift-outline",
        onPress: () =>
          Alert.alert(
            "Em breve",
            "O resgate de vale-presente estará disponível em breve.",
          ),
      },
      {
        id: "support",
        label: "Suporte",
        icon: "chatbubble-ellipses-outline",
        onPress: openHelp,
      },
    ],
    [router, openHelp],
  );

  return (
    <View className="mt-4">
      {profileActions.map((action, index) => (
        <View key={action.id}>
          <Pressable
            onPress={action.onPress}
            accessibilityRole="button"
            accessibilityLabel={action.label}
            className="flex-row items-center gap-3 py-4 px-1"
          >
            <View className="h-7 w-7 items-center justify-center">
              <Ionicons name={action.icon} size={20} color="#FFFFFF" />
            </View>
            <Text className="flex-1 font-sans text-lg font-bold text-white">
              {action.label}
            </Text>
          </Pressable>

          {index < profileActions.length - 1 ? (
            <View className="h-px w-full bg-white/10" />
          ) : null}
        </View>
      ))}
    </View>
  );
};
