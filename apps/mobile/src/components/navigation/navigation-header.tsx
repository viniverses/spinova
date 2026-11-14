import { Ionicons } from "@expo/vector-icons";
import type { ReactNode } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { HeaderIconButton } from "./header-icon-button";

export type NavigationHeaderProps = {
  leading?: ReactNode;
  onPressBack?: () => void;
  onPressHelp?: () => void;
  children: ReactNode;
  safeArea?: boolean;
  className?: string;
};

export function NavigationHeader({
  leading,
  onPressBack,
  onPressHelp,
  children,
  safeArea = false,
  className = "py-3",
}: NavigationHeaderProps) {
  const content = (
    <View className={`flex-row items-center gap-3 px-4 ${className}`}>
      {leading ?? (
        <HeaderIconButton onPress={onPressBack} accessibilityLabel="Voltar">
          <Ionicons name="chevron-back" size={22} color="#D4D4D4" />
        </HeaderIconButton>
      )}

      {children}

      <HeaderIconButton onPress={onPressHelp} accessibilityLabel="Ajuda">
        <View className="h-8 w-8 items-center justify-center rounded-full bg-white/10">
          <Ionicons name="help" size={20} color="#D4D4D4" />
        </View>
      </HeaderIconButton>
    </View>
  );

  if (safeArea) {
    return (
      <SafeAreaView className="bg-black" edges={["top", "left", "right"]}>
        {content}
      </SafeAreaView>
    );
  }

  return content;
}
