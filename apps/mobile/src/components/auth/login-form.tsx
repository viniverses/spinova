import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { useSession } from "../../hooks/use-auth";
import { authClient } from "../../lib/auth-client";
import { colors } from "../../lib/theme";
import { loginSchema, type LoginFormValues } from "../../schemas/auth/login";
import { TextInput } from "../ui/textinput";
import { PasswordVisibilityToggle } from "./password-visibility-toggle";

export const LoginForm = () => {
  const router = useRouter();
  const { refetch: refetchSession } = useSession();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

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
      setIsLoggingIn(true);

      try {
        const { error } = await authClient.signIn.email({
          email: values.email.trim(),
          password: values.password,
        });

        if (error) {
          setIsLoggingIn(false);
          setError("root", {
            message: error.message || "Não foi possível entrar.",
          });
          return;
        }

        // Aguarda a sessão ser atualizada completamente
        const result = await refetchSession();

        // Só navega para home se a sessão foi carregada com sucesso
        if (result.data?.user) {
          router.replace("/home");
        } else {
          setIsLoggingIn(false);
          setError("root", {
            message: "Falha ao carregar sessão. Tente novamente.",
          });
        }
      } catch {
        setIsLoggingIn(false);
        setError("root", { message: "Algo deu errado. Tente novamente." });
      }
    },
    [refetchSession, setError, clearErrors, router],
  );

  const busy = isSubmitting || isLoggingIn;

  return (
    <>
      <Text className="mb-2 text-center font-syne-bold text-3xl text-white">
        Bem vindo!
      </Text>
      <Text className="mb-6 text-center font-golos text-base leading-6 text-white/70">
        Entre e descubra novos sons.
      </Text>

      {errors.root?.message ? (
        <View
          className="mb-4 rounded-xl border border-error/30 bg-error/10 px-4 py-3"
          accessibilityLiveRegion="polite"
        >
          <Text className="font-golos text-sm leading-5 text-error">
            {errors.root.message}
          </Text>
        </View>
      ) : null}

      <View className="mb-4">
        <Text className="mb-2 font-golos-semibold text-sm text-white/80">
          E-mail
        </Text>
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="voce@exemplo.com"
              placeholderTextColor="rgba(255,255,255,0.38)"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
              textContentType="emailAddress"
              returnKeyType="next"
              value={value}
              onChangeText={(text) => {
                onChange(text);
                clearErrors("root");
              }}
              onBlur={onBlur}
              editable={!busy}
              accessibilityLabel="E-mail"
            />
          )}
        />
        {errors.email?.message ? (
          <Text
            className="mt-2 font-golos text-sm text-error"
            accessibilityLiveRegion="polite"
          >
            {errors.email.message}
          </Text>
        ) : null}
      </View>

      <View className="mb-6">
        <Text className="mb-2 font-golos-semibold text-sm text-white/80">
          Senha
        </Text>
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <View className="relative">
              <TextInput
                placeholder="Digite sua senha"
                placeholderTextColor="rgba(255,255,255,0.38)"
                secureTextEntry={!passwordVisible}
                autoComplete="current-password"
                textContentType="password"
                returnKeyType="done"
                value={value}
                onChangeText={(text) => {
                  onChange(text);
                  clearErrors("root");
                }}
                onBlur={onBlur}
                onSubmitEditing={handleSubmit(onSubmit)}
                editable={!busy}
                className="pr-16"
                accessibilityLabel="Senha"
              />
              <PasswordVisibilityToggle
                visible={passwordVisible}
                disabled={busy}
                onPress={() => setPasswordVisible((visible) => !visible)}
              />
            </View>
          )}
        />
        {errors.password?.message ? (
          <Text
            className="mt-2 font-golos text-sm text-error"
            accessibilityLiveRegion="polite"
          >
            {errors.password.message}
          </Text>
        ) : null}
      </View>

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
