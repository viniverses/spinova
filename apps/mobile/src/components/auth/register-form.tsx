import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { ActivityIndicator, Pressable, Text } from "react-native";
import { useSession, useSignUp } from "../../hooks/use-auth";
import { colors } from "../../lib/theme";
import {
  registerSchema,
  type RegisterFormValues,
} from "../../schemas/auth/register";
import { FormField } from "../ui/form-field";
import { AuthErrorBanner } from "./auth-error-banner";
import { PasswordField } from "./password-field";

export const RegisterForm = () => {
  const router = useRouter();
  const { refetch: refetchSession } = useSession();
  const { mutateAsync: signUp } = useSignUp();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    mode: "onSubmit",
  });

  const onSubmit = useCallback(
    async (values: RegisterFormValues) => {
      clearErrors("root");

      try {
        const { error } = await signUp(values);

        if (error) {
          setError("root", {
            message: error.message || "Não foi possível criar a conta.",
          });
          return;
        }

        await refetchSession();
        router.replace("/");
      } catch {
        setError("root", { message: "Algo deu errado. Tente novamente." });
      }
    },
    [router, refetchSession, signUp, setError, clearErrors],
  );

  const busy = isSubmitting;
  const clearRootError = useCallback(() => clearErrors("root"), [clearErrors]);

  return (
    <>
      <Text className="mb-2 text-center font-syne-bold text-3xl text-white">
        Registre-se
      </Text>
      <Text className="mb-6 text-center font-golos text-base leading-6 text-white/70">
        Crie sua conta e descubra novos sons.
      </Text>

      <AuthErrorBanner message={errors.root?.message} />

      <FormField
        control={control}
        name="name"
        label="Nome"
        placeholder="Como podemos chamar você?"
        autoCapitalize="words"
        autoCorrect={false}
        autoComplete="name"
        textContentType="name"
        returnKeyType="next"
        disabled={busy}
        containerClassName="mb-4"
        accessibilityLabel="Nome"
        onChangeText={clearRootError}
      />

      <FormField
        control={control}
        name="email"
        label="E-mail"
        placeholder="voce@exemplo.com"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="email"
        textContentType="emailAddress"
        returnKeyType="next"
        disabled={busy}
        containerClassName="mb-4"
        accessibilityLabel="E-mail"
        onChangeText={clearRootError}
      />

      <PasswordField
        control={control}
        name="password"
        label="Senha"
        placeholder="8+ caracteres, com letras e número"
        autoComplete="new-password"
        textContentType="newPassword"
        returnKeyType="done"
        disabled={busy}
        containerClassName="mb-6"
        accessibilityLabel="Senha"
        accessibilityHint="Use pelo menos oito caracteres, uma letra maiúscula, uma minúscula e um número"
        onSubmitEditing={handleSubmit(onSubmit)}
        onChangeText={clearRootError}
      />

      <Pressable
        onPress={handleSubmit(onSubmit)}
        disabled={busy}
        className="min-h-14 flex-row items-center justify-center rounded-2xl bg-primary px-6 active:opacity-80 disabled:opacity-50"
        accessibilityRole="button"
        accessibilityLabel="Criar conta na Spinova"
        accessibilityHint="Envia seus dados para criar uma conta"
        accessibilityState={{ disabled: busy, busy }}
      >
        {busy ? (
          <ActivityIndicator color={colors.primary.foreground} />
        ) : (
          <Text className="font-golos-semibold text-base text-white">
            Criar conta
          </Text>
        )}
      </Pressable>
    </>
  );
};
