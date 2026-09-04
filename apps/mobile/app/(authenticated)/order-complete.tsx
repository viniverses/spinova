import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import { BackHandler, Platform, Pressable, Text, View } from "react-native";
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  ReduceMotion,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import { PurchaseCompleteMark } from "@/components/checkout/purchase-complete-mark";

export default function OrderCompleteScreen() {
  const router = useRouter();
  const { total } = useLocalSearchParams<{ total?: string }>();
  const displayTotal =
    typeof total === "string" && total.trim() ? total : "R$ 0,00";

  useEffect(() => {
    if (Platform.OS !== "android") {
      return;
    }

    const handleBack = () => {
      router.replace("/home");
      return true;
    };

    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBack,
    );

    return () => subscription.remove();
  }, [router]);

  const returnHome = () => {
    router.replace("/home");
  };

  return (
    <View className="flex-1 bg-black">
      <SafeAreaView
        className="flex-1"
        edges={["top", "bottom", "left", "right"]}
      >
        <View className="flex-1 p-4 justify-between">
          <View className="w-full flex-1 items-center justify-center">
            <PurchaseCompleteMark />

            <Animated.View
              entering={FadeInDown.duration(500)
                .delay(2000)
                .easing(Easing.out(Easing.cubic))
                .reduceMotion(ReduceMotion.System)}
              className="mt-7 w-full items-center"
            >
              <Text
                style={{ textAlign: "center" }}
                className="w-full text-center font-sans text-[36px] leading-[42px] text-white"
              >
                Compra concluída
              </Text>
              <Text
                style={{ textAlign: "center" }}
                className="mt-3 w-full max-w-[320px] self-center text-center font-golos text-base leading-6 text-white/65"
              >
                Seu pedido foi recebido.{"\n"}Agora é só preparar o toca-discos.
              </Text>
            </Animated.View>

            <Animated.View
              entering={FadeIn.duration(450)
                .delay(2250)
                .reduceMotion(ReduceMotion.System)}
              className="w-full"
            >
              <View className="w-full border-y border-white/15 py-3 mt-5">
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-3">
                    <View className="h-11 w-11 items-center justify-center rounded-full bg-[#211D1F]">
                      <Ionicons
                        name="receipt-outline"
                        size={21}
                        color="#E14842"
                      />
                    </View>
                    <View>
                      <Text className="font-golos text-sm text-white/55">
                        Total do pedido
                      </Text>
                      <Text className="mt-0.5 font-golos-semibold text-lg text-white">
                        {displayTotal}
                      </Text>
                    </View>
                  </View>
                  <Ionicons name="checkmark" size={24} color="#E14842" />
                </View>
              </View>
            </Animated.View>
          </View>

          <Animated.View
            entering={FadeIn.duration(420)
              .delay(2450)
              .reduceMotion(ReduceMotion.System)}
            className="w-full pt-3"
          >
            <Pressable
              onPress={returnHome}
              accessibilityRole="button"
              accessibilityLabel="Voltar ao início"
              className="min-h-14 w-full flex-row items-center justify-center gap-2 rounded-xl bg-primary px-5 active:opacity-85"
            >
              <Text className="font-sans text-xl text-white">
                Voltar ao início
              </Text>
              <Ionicons name="arrow-forward" size={23} color="#FFFFFF" />
            </Pressable>
          </Animated.View>
        </View>
      </SafeAreaView>
    </View>
  );
}
