import { Ionicons } from "@expo/vector-icons";

import { colors } from "@/lib/theme";

import { FeedbackState, type FeedbackStateProps } from "./feedback-state";

type ErrorStateProps = Omit<FeedbackStateProps, "action" | "title"> & {
  title: string;
  onRetry: () => void;
  retryAccessibilityLabel?: string;
};

export function ErrorState({
  onRetry,
  retryAccessibilityLabel,
  icon = (
    <Ionicons
      name="alert-circle-outline"
      size={52}
      color={colors.primary.DEFAULT}
    />
  ),
  ...props
}: ErrorStateProps) {
  return (
    <FeedbackState
      {...props}
      icon={icon}
      action={{
        label: "Tentar novamente",
        onPress: onRetry,
        accessibilityLabel: retryAccessibilityLabel,
      }}
    />
  );
}
