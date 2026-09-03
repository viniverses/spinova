import { Redirect } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { HelpDrawer } from "@/components/help/help-drawer";
import { HomeHeader } from "@/components/home/home-header";
import { AppTabs } from "@/components/navigation/app-tabs";
import { useSession } from "@/hooks/use-auth";

export default function AuthenticatedLayout() {
  const { data, isPending } = useSession();
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  if (isPending) {
    return <View className="flex-1 bg-[#171518]" />;
  }

  if (!data?.user) {
    return <Redirect href="/login" />;
  }

  return (
    <View className="flex-1 bg-black">
      <StatusBar style="light" />
      <SafeAreaView className="bg-black" edges={["top", "left", "right"]}>
        <HomeHeader onPressHelp={() => setIsHelpOpen(true)} />
      </SafeAreaView>
      <View className="flex-1">
        <AppTabs />
      </View>
      <HelpDrawer isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </View>
  );
}
