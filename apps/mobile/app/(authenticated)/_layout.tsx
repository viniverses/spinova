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
import { HelpProvider, useHelp } from "@/providers/help-provider";

const NO_HEADER_ROUTES = new Set([
  "/search",
  "/cart",
  "/checkout",
  "/order-complete",
]);

function AuthenticatedContent() {
  const { isHelpOpen, closeHelp, openHelp } = useHelp();
  const pathname = usePathname();
  const router = useRouter();

  const hideHeader = NO_HEADER_ROUTES.has(pathname);
  const showBackButton = pathname !== "/home";

  const handleBackPress = () => {
    if (pathname.startsWith("/help")) {
      openHelp();
    }
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/home");
    }
  };

  return (
    <View className="flex-1 bg-black">
      <StatusBar style="light" />
      {!hideHeader ? (
        <SafeAreaView className="bg-black" edges={["top", "left", "right"]}>
          <HomeHeader
            leadingVariant={showBackButton ? "back" : "brand"}
            onPressLogo={showBackButton ? handleBackPress : undefined}
            onPressSearch={() => router.push("/search" as never)}
            onPressHelp={openHelp}
          />
        </SafeAreaView>
      ) : null}
      <View className="flex-1">
        <AppTabs />
      </View>
      <HelpDrawer isOpen={isHelpOpen} onClose={closeHelp} />
    </View>
  );
}

export default function AuthenticatedLayout() {
  const { data, isPending } = useSession();

  if (isPending) {
    return <LoadingScreen />;
  }

  if (!data?.user) {
    return <Redirect href="/login" />;
  }

  return (
    <HelpProvider>
      <AuthenticatedContent />
    </HelpProvider>
  );
}
