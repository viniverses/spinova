import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { ActivityIndicator, Pressable, Text } from "react-native";
import { useSession, useSignIn } from "../../hooks/use-auth";
import { colors } from "../../lib/theme";
import { loginSchema, type LoginFormValues } from "../../schemas/auth/login";
import { FormField } from "../ui/form-field";
import { AuthErrorBanner } from "./auth-error-banner";
import { PasswordField } from "./password-field";

export const LoginForm = () => {
  const router = useRouter();
  const { refetch: refetchSession } = useSession();
  const { mutateAsync: signIn } = useSignIn();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onSubmit",
  });

  const onSubmit = useCallback(
    async (values: LoginFormValues) => {
      clearErrors("root");

      try {
        const { error } = await signIn(values);

        if (error) {
          setError("root", {
            message:
              error.message ||
              "E-mail ou senha incorretos. Verifique seus dados e tente novamente.",
          });
          return;
        }

        // Aguarda a sessão ser atualizada completamente
        await refetchSession();
        router.replace("/home");
      } catch {
        setError("root", {
          message: "Não foi possível conectar ao servidor. Tente novamente.",
        });
      }
    },
    [refetchSession, signIn, setError, clearErrors, router],
  );

  const busy = isSubmitting;
  const clearRootError = useCallback(() => clearErrors("root"), [clearErrors]);

  return (
    <>
      <Text className="mb-2 text-center font-syne-bold text-3xl text-white">
        Bem-vindo!
      </Text>
      <Text className="mb-6 text-center font-golos text-base leading-6 text-white/70">
        Entre e descubra novos sons.
      </Text>

      <AuthErrorBanner message={errors.root?.message} />

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
        placeholder="Digite sua senha"
        autoComplete="current-password"
        textContentType="password"
        returnKeyType="done"
        disabled={busy}
        containerClassName="mb-6"
        accessibilityLabel="Senha"
        onSubmitEditing={handleSubmit(onSubmit)}
        onChangeText={clearRootError}
      />

      <Pressable
        onPress={handleSubmit(onSubmit)}
        disabled={busy}
        className="min-h-14 flex-row items-center justify-center rounded-2xl bg-primary px-6 active:opacity-80 disabled:opacity-50"
        accessibilityRole="button"
        accessibilityLabel="Entrar na Spinova"
        accessibilityHint="Envia seus dados para acessar a conta"
        accessibilityState={{ disabled: busy, busy }}
      >
        {busy ? (
          <ActivityIndicator color={colors.primary.foreground} />
        ) : (
          <Text className="font-golos-semibold text-base text-white">
            Entrar
          </Text>
        )}
      </Pressable>
    </>
  );
};
