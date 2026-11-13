import { ActivityIndicator, Text, View } from "react-native";

import { colors } from "@/lib/theme";

type LoadingStateProps = {
  message?: string;
  className?: string;
};

export function LoadingState({ message, className }: LoadingStateProps) {
  return (
    <View
      accessibilityState={{ busy: true }}
      className={`flex-1 items-center justify-center ${className ?? ""}`}
    >
      <ActivityIndicator size="large" color={colors.primary.DEFAULT} />
      {message ? (
        <Text className="mt-4 text-center font-golos text-sm text-white/60">
          {message}
        </Text>
      ) : null}
    </View>
  );
}
