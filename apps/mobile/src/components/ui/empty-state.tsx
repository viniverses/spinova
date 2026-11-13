import { Ionicons } from "@expo/vector-icons";

import { FeedbackState, type FeedbackStateProps } from "./feedback-state";

export function EmptyState({
  icon = <Ionicons name="disc-outline" size={52} color="#777179" />,
  ...props
}: FeedbackStateProps) {
  return <FeedbackState {...props} icon={icon} />;
}
