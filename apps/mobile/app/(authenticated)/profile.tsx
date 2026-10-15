import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { authClient } from "@/lib/auth-client";
import { useSession } from "@/hooks/use-auth";
import { colors } from "@/lib/theme";
import { ProfileActionsMenu } from "@/components/profile/profile-actions-menu";

const SCROLL_BOTTOM_PADDING = 112;

export default function ProfileScreen() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const logout = useMutation({
    mutationFn: async () => {
      const { error } = await authClient.signOut();
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.clear();
    },
    onError: (error) => {
      console.error("Erro ao deslogar:", error);
    },
  });

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

          <ProfileActionsMenu />

          {logout.isError ? (
            <View
              className="mt-6 rounded-xl border border-error/30 bg-error/10 px-4 py-3"
              accessibilityLiveRegion="polite"
            >
              <Text className="font-golos text-sm leading-5 text-error">
                Não foi possível sair da conta. Tente novamente.
              </Text>
            </View>
          ) : null}

          <Pressable
            onPress={() => logout.mutate()}
            disabled={logout.isPending}
            accessibilityRole="button"
            accessibilityLabel="Deslogar"
            className="mt-6 items-center justify-center rounded-2xl bg-primary py-4 active:opacity-90 disabled:opacity-50"
          >
            {logout.isPending ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text className="font-sans text-base font-bold text-white">
                Deslogar
              </Text>
            )}
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
