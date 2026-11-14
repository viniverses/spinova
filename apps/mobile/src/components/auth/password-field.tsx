import { useState } from "react";
import type { FieldPathByValue, FieldValues } from "react-hook-form";
import { FormField, type FormFieldProps } from "../ui/form-field";
import { PasswordVisibilityToggle } from "./password-visibility-toggle";

type PasswordFieldProps<
  TFieldValues extends FieldValues,
  TName extends FieldPathByValue<TFieldValues, string | undefined>,
> = Omit<
  FormFieldProps<TFieldValues, TName>,
  "secureTextEntry" | "rightAccessory"
>;

export function PasswordField<
  TFieldValues extends FieldValues,
  TName extends FieldPathByValue<TFieldValues, string | undefined>,
>({
  disabled = false,
  className,
  ...props
}: PasswordFieldProps<TFieldValues, TName>) {
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <FormField
      {...props}
      disabled={disabled}
      secureTextEntry={!passwordVisible}
      className={className ? `pr-16 ${className}` : "pr-16"}
      rightAccessory={
        <PasswordVisibilityToggle
          visible={passwordVisible}
          disabled={disabled}
          onPress={() => setPasswordVisible((visible) => !visible)}
        />
      }
    />
  );
}
