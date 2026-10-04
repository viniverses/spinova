import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";

import { AddressForm } from "@/components/address/address-form";

const CONTENT_BOTTOM_PADDING = 116;
type AddressReturnTo = "/checkout" | "/profile";

export default function AddressScreen() {
  const router = useRouter();
  const { id, returnTo } = useLocalSearchParams<{
    id?: string;
    returnTo?: AddressReturnTo;
  }>();

  const handleNavigateBack = useCallback(() => {
    if (returnTo) {
      router.replace(returnTo);
    } else if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/checkout");
    }
  }, [returnTo, router]);

  return (
    <View className="flex-1 bg-black">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 20,
            paddingTop: 12,
            paddingBottom: CONTENT_BOTTOM_PADDING,
          }}
        >
          <View>
            <Text className="font-sans text-2xl font-bold text-white">
              {id ? "Editar endereço" : "Endereço de entrega"}
            </Text>
            <Text className="mt-2 font-golos text-sm text-white/60">
              Informe seu CEP para preencher o endereço automaticamente através
              da base dos Correios.
            </Text>
          </View>

          <AddressForm id={id} onSaved={handleNavigateBack} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
