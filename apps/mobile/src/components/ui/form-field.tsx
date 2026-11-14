import type { ReactNode } from "react";
import {
  Controller,
  type Control,
  type FieldPathByValue,
  type FieldValues,
} from "react-hook-form";
import { Text, View } from "react-native";
import { TextInput, type TextInputProps } from "./textinput";

export type FormFieldProps<
  TFieldValues extends FieldValues,
  TName extends FieldPathByValue<TFieldValues, string | undefined>,
> = Omit<TextInputProps, "value" | "defaultValue"> & {
  control: Control<TFieldValues>;
  name: TName;
  label: string;
  disabled?: boolean;
  transform?: (value: string) => string;
  rightAccessory?: ReactNode;
  containerClassName?: string;
};

export function FormField<
  TFieldValues extends FieldValues,
  TName extends FieldPathByValue<TFieldValues, string | undefined>,
>({
  control,
  name,
  label,
  disabled = false,
  transform,
  rightAccessory,
  containerClassName,
  className,
  editable,
  onChangeText,
  onBlur: onBlurProp,
  ...inputProps
}: FormFieldProps<TFieldValues, TName>) {
  return (
    <View className={containerClassName}>
      <Text className="mb-2 font-golos-semibold text-sm text-white/80">
        {label}
      </Text>
      <Controller
        control={control}
        name={name}
        render={({
          field: { onChange, onBlur, value },
          fieldState: { error },
        }) => {
          const input = (
            <TextInput
              {...inputProps}
              className={className}
              value={typeof value === "string" ? value : ""}
              onChangeText={(text) => {
                const nextValue = transform ? transform(text) : text;
                onChange(nextValue);
                onChangeText?.(nextValue);
              }}
              onBlur={(event) => {
                onBlur();
                onBlurProp?.(event);
              }}
              editable={editable ?? !disabled}
            />
          );

          return (
            <>
              {rightAccessory ? (
                <View className="relative">
                  {input}
                  {rightAccessory}
                </View>
              ) : (
                input
              )}
              {error?.message ? (
                <Text
                  className="mt-2 font-golos text-sm text-error"
                  accessibilityLiveRegion="polite"
                >
                  {error.message}
                </Text>
              ) : null}
            </>
          );
        }}
      />
    </View>
  );
}
