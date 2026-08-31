import { forwardRef } from "react";
import {
  TextInput as NativeTextInput,
  type TextInputProps as NativeTextInputProps,
} from "react-native";

export type TextInputProps = NativeTextInputProps & {
  className?: string;
};

const baseClassName =
  "min-h-14 rounded-2xl border border-white/10 bg-black/20 px-4 py-2 font-golos text-base text-white focus:border-primary-soft";

export const TextInput = forwardRef<NativeTextInput, TextInputProps>(
  (
    {
      className,
      placeholderTextColor = "rgba(255,255,255,0.38)",
      style,
      textAlignVertical = "center",
      ...props
    },
    ref,
  ) => (
    <NativeTextInput
      ref={ref}
      className={`${baseClassName}${className ? ` ${className}` : ""}`}
      placeholderTextColor={placeholderTextColor}
      textAlignVertical={textAlignVertical}
      style={[{ lineHeight: 16 }, style]}
      {...props}
    />
  ),
);

TextInput.displayName = "TextInput";
