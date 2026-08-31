import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { AuthBackground } from "./auth-background";
import { AuthBrand } from "./auth-brand";
import { AuthGlassCard } from "./auth-glass-card";
import { AuthScrim } from "./auth-scrim";
import { LoginForm } from "./login-form";
import { RegisterForm } from "./register-form";

const AuthScreen = () => {
  const insets = useSafeAreaInsets();
  const { width: windowWidth } = useWindowDimensions();
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  const horizontalGutter = windowWidth < 380 ? 20 : 32;

  return (
    <View className="flex-1 bg-[#171518]">
      <AuthBackground />
      <AuthScrim />

      <SafeAreaView
        className="flex-1"
        edges={["top", "left", "right", "bottom"]}
      >
        <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <ScrollView
            bounces={false}
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: "flex-end",
              alignItems: "center",
              paddingHorizontal: horizontalGutter,
              paddingTop: 16,
              paddingBottom: Math.max(insets.bottom, 16),
            }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <AuthGlassCard>
              <AuthBrand />

              {isRegisterMode ? <RegisterForm /> : <LoginForm />}

              <View className="mt-4 border-t border-white/10 pt-2">
                <Pressable
                  onPress={() => setIsRegisterMode(!isRegisterMode)}
                  className="min-h-12 flex-row flex-wrap content-center items-center justify-center gap-x-1 rounded-xl px-3 py-2 active:bg-white/5"
                  accessibilityRole="button"
                  accessibilityLabel={
                    isRegisterMode
                      ? "Já tenho uma conta, fazer login"
                      : "Ainda não tenho uma conta, criar conta"
                  }
                  accessibilityHint="Alterna entre os formulários de login e cadastro"
                >
                  <Text className="font-golos text-sm text-white/70">
                    {isRegisterMode
                      ? "Já tem uma conta?"
                      : "Ainda não tem uma conta?"}
                  </Text>
                  <Text className="font-golos-semibold text-sm text-primary-soft">
                    {isRegisterMode ? "Fazer login" : "Criar conta"}
                  </Text>
                </Pressable>
              </View>
            </AuthGlassCard>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

export default AuthScreen;
