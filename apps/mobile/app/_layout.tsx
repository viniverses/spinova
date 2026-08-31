import "../src/global.css";

import {
  Syne_400Regular,
  Syne_700Bold,
  useFonts,
} from "@expo-google-fonts/syne";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useSession } from "../src/hooks/use-auth";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Syne_400Regular,
    Syne_700Bold,
    "GolosText-Regular": require("../assets/fonts/golos-text-regular.ttf"),
    "GolosText-SemiBold": require("../assets/fonts/golos-text-semibold.ttf"),
  });
  const { isPending: isSessionLoading } = useSession();

  useEffect(() => {
    if (fontsLoaded && !isSessionLoading) {
      void SplashScreen.hideAsync();
    }
  }, [fontsLoaded, isSessionLoading]);

  if (!fontsLoaded || isSessionLoading) {
    return <View className="flex-1 bg-[#171518]" />;
  }

  return (
    <SafeAreaProvider>
      <View className="flex-1 font-sans">
        <Stack
          screenOptions={{
            headerShown: false,
            animation: "slide_from_right",
          }}
        />
      </View>
    </SafeAreaProvider>
  );
}
