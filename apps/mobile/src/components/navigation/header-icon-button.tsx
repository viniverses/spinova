import type { ReactNode } from "react";
import { Pressable, type PressableProps } from "react-native";

export type HeaderIconButtonProps = Omit<PressableProps, "children"> & {
  children: ReactNode;
  variant?: "default" | "primary";
  className?: string;
};

export function HeaderIconButton({
  children,
  variant = "default",
  className,
  accessibilityRole = "button",
  ...props
}: HeaderIconButtonProps) {
  const variantClassName =
    variant === "primary"
      ? "overflow-hidden bg-primary"
      : "bg-surface-control";

  return (
    <Pressable
      accessibilityRole={accessibilityRole}
      className={`h-12 w-12 items-center justify-center rounded-2xl active:opacity-90 ${variantClassName}${className ? ` ${className}` : ""}`}
      {...props}
    >
      {children}
    </Pressable>
  );
}
