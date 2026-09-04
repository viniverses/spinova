import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import type { ComponentProps } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { authClient } from "@/lib/auth-client";
import { useSession } from "@/hooks/use-auth";
import { colors } from "@/lib/theme";

const SCROLL_BOTTOM_PADDING = 112;

type ProfileAction = {
  id: string;
  label: string;
  icon: ComponentProps<typeof Ionicons>["name"];
};

export default function ProfileScreen() {
  const router = useRouter();
  const { data: session } = useSession();

  const profileActions: ProfileAction[] = [
    { id: "orders", label: "Seus pedidos", icon: "checkmark-circle-outline" },
    { id: "account", label: "Sua conta", icon: "person-outline" },
    { id: "wishlist", label: "Lista de desejos", icon: "heart-outline" },
    { id: "coupons", label: "Cupons", icon: "ticket-outline" },
    { id: "giftcards", label: "Vale-presente", icon: "gift-outline" },
    { id: "support", label: "Suporte", icon: "chatbubble-ellipses-outline" },
  ];

  const handleActionPress = (id: string) => {
    if (id === "wishlist") {
      router.push("/wishlist" as never);
    }
  };

  const handleLogoutPress = async () => {
    await authClient.signOut();
  };

  return (
    <View className="flex-1 bg-black">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: SCROLL_BOTTOM_PADDING }}
      >
        <View className="px-4 pt-1">
          <View className="flex-row items-center gap-4">
            <View className="h-16 w-16 items-center justify-center rounded-2xl bg-[#F4C24C]">
              <Ionicons
                name="globe-outline"
                size={26}
                color={colors.primary.DEFAULT}
              />
            </View>

            <View className="flex-1">
              <Text className="font-sans text-2xl font-bold text-white">
                {session?.user.name}
              </Text>
              <Text className="mt-1 font-sans text-sm text-white/60">
                {session?.user.email}
              </Text>
            </View>
          </View>

          <View className="mt-4">
            {profileActions.map((action, index) => (
              <View key={action.id}>
                <Pressable
                  onPress={() => handleActionPress(action.id)}
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

          <Pressable
            onPress={handleLogoutPress}
            accessibilityRole="button"
            accessibilityLabel="Deslogar"
            className="mt-6 items-center justify-center rounded-2xl bg-primary py-4 active:opacity-90"
          >
            <Text className="font-sans text-base font-bold text-white">
              Deslogar
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
