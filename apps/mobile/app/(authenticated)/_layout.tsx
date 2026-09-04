import { Redirect, usePathname, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { HelpDrawer } from "@/components/help/help-drawer";
import { HomeHeader } from "@/components/home/home-header";
import { AppTabs } from "@/components/navigation/app-tabs";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { useSession } from "@/hooks/use-auth";

const NO_HEADER_ROUTES = new Set([
  "/search",
  "/cart",
  "/checkout",
  "/address",
  "/order-complete",
]);

export default function AuthenticatedLayout() {
  const { data, isPending } = useSession();
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  if (isPending) {
    return <LoadingScreen />;
  }

  if (!data?.user) {
    return <Redirect href="/login" />;
  }

  const hideHeader = NO_HEADER_ROUTES.has(pathname);
  const showBackButton = pathname !== "/home";

  return (
    <View className="flex-1 bg-black">
      <StatusBar style="light" />
      {!hideHeader ? (
        <SafeAreaView className="bg-black" edges={["top", "left", "right"]}>
          <HomeHeader
            leadingVariant={showBackButton ? "back" : "brand"}
            onPressLogo={showBackButton ? () => router.back() : undefined}
            onPressSearch={() => router.push("/search" as never)}
            onPressHelp={() => setIsHelpOpen(true)}
          />
        </SafeAreaView>
      ) : null}
      <View className="flex-1">
        <AppTabs />
      </View>
      <HelpDrawer isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </View>
  );
}
