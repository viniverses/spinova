import { Text, View } from "react-native";

type AuthErrorBannerProps = {
  message?: string;
};

export function AuthErrorBanner({ message }: AuthErrorBannerProps) {
  if (!message) {
    return null;
  }

  return (
    <View
      className="mb-4 rounded-xl border border-error/30 bg-error/10 px-4 py-3"
      accessibilityLiveRegion="polite"
    >
      <Text className="font-golos text-sm leading-5 text-error">{message}</Text>
    </View>
  );
}
