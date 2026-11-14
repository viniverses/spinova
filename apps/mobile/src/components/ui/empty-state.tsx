import { Ionicons } from "@expo/vector-icons";

import { colors } from "@/lib/theme";

import { FeedbackState, type FeedbackStateProps } from "./feedback-state";

export function EmptyState({
  icon = (
    <Ionicons name="disc-outline" size={52} color={colors.muted.foreground} />
  ),
  ...props
}: FeedbackStateProps) {
  return <FeedbackState {...props} icon={icon} />;
}
