import "react-native-gesture-handler";
import "../src/global.css";

import {
  Syne_400Regular,
  Syne_700Bold,
  useFonts,
} from "@expo-google-fonts/syne";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useRef } from "react";
import { View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { LoadingScreen } from "../src/components/ui/loading-screen";
import { useSession } from "../src/hooks/use-auth";
import { QueryProvider } from "../src/providers/query-provider";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Syne_400Regular,
    Syne_700Bold,
    "GolosText-Regular": require("../assets/fonts/golos-text-regular.ttf"),
    "GolosText-SemiBold": require("../assets/fonts/golos-text-semibold.ttf"),
  });
  const { isPending: isSessionLoading } = useSession();
  const isInitialLoad = useRef(true);

  useEffect(() => {
    if (fontsLoaded && !isSessionLoading && isInitialLoad.current) {
      isInitialLoad.current = false;
      void SplashScreen.hideAsync();
    }
  }, [fontsLoaded, isSessionLoading]);

  if (!fontsLoaded || (isSessionLoading && isInitialLoad.current)) {
    return <LoadingScreen />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryProvider>
        <SafeAreaProvider>
          <BottomSheetModalProvider>
            <View className="flex-1 font-sans">
              <Stack
                screenOptions={{
                  headerShown: false,
                  animation: "slide_from_right",
                  contentStyle: { backgroundColor: "#000000" },
                }}
              />
            </View>
          </BottomSheetModalProvider>
        </SafeAreaProvider>
      </QueryProvider>
    </GestureHandlerRootView>
  );
}
