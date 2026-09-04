import { usePathname, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { HelpDrawer } from "@/components/help/help-drawer";
import { HomeHeader } from "@/components/home/home-header";
import { AppTabs } from "@/components/navigation/app-tabs";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { useSession } from "@/hooks/use-auth";

export default function AuthenticatedLayout() {
  const { data, isPending } = useSession();
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const showBackButton = pathname !== "/home";

  // Mostra loading enquanto carrega ou se não há usuário
  // O redirecionamento é handled por login.tsx e index.tsx
  if (isPending || !data?.user) {
    return <LoadingScreen />;
  }

  return (
    <View className="flex-1 bg-black">
      <StatusBar style="light" />
      <SafeAreaView className="bg-black" edges={["top", "left", "right"]}>
        <HomeHeader
          leadingVariant={showBackButton ? "back" : "brand"}
          onPressLogo={showBackButton ? () => router.back() : undefined}
          onPressHelp={() => setIsHelpOpen(true)}
        />
      </SafeAreaView>
      <View className="flex-1">
        <AppTabs />
      </View>
      <HelpDrawer isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </View>
  );
}
