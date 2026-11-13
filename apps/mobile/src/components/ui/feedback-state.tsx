import type { ReactNode } from "react";
import { Pressable, Text, View } from "react-native";

export type StateAction = {
  label: string;
  onPress: () => void;
  accessibilityLabel?: string;
};

export type FeedbackStateProps = {
  icon?: ReactNode;
  title?: string;
  description?: string;
  action?: StateAction;
  /** Layout spacing/background supplied by the screen or list. */
  className?: string;
  children?: ReactNode;
};

/** Shared presentation only; fetching and navigation stay with the caller. */
export function FeedbackState({
  icon,
  title,
  description,
  action,
  className,
  children,
}: FeedbackStateProps) {
  return (
    <View
      className={`flex-1 items-center justify-center px-5 ${className ?? ""}`}
    >
      {icon}
      {title ? (
        <Text className="mt-5 text-center font-sans text-xl text-white">
          {title}
        </Text>
      ) : null}
      {description ? (
        <Text className="mt-2 max-w-72 text-center font-golos text-sm leading-5 text-white/60">
          {description}
        </Text>
      ) : null}
      {action ? (
        <Pressable
          onPress={action.onPress}
          accessibilityRole="button"
          accessibilityLabel={action.accessibilityLabel ?? action.label}
          className="mt-6 min-h-12 items-center justify-center rounded-2xl bg-primary px-6 active:opacity-80"
        >
          <Text className="font-golos-semibold text-sm text-white">
            {action.label}
          </Text>
        </Pressable>
      ) : null}
      {children}
    </View>
  );
}
