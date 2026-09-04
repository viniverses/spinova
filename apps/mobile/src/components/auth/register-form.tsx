import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { useSession } from "../../hooks/use-auth";
import { authClient } from "../../lib/auth-client";
import { colors } from "../../lib/theme";
import {
  registerSchema,
  type RegisterFormValues,
} from "../../schemas/auth/register";
import { TextInput } from "../ui/textinput";
import { PasswordVisibilityToggle } from "./password-visibility-toggle";

export const RegisterForm = () => {
  const router = useRouter();
  const { refetch: refetchSession } = useSession();
  const [passwordVisible, setPasswordVisible] = useState(false);

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
        const { error } = await authClient.signUp.email({
          email: values.email.trim(),
          password: values.password,
          name: values.name.trim(),
        });

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
    [router, refetchSession, setError, clearErrors],
  );

  const busy = isSubmitting;

  return (
    <>
      <Text className="mb-2 text-center font-syne-bold text-3xl text-white">
        Registre-se
      </Text>
      <Text className="mb-6 text-center font-golos text-base leading-6 text-white/70">
        Crie sua conta e descubra novos sons.
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
          Nome
        </Text>
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="Como podemos chamar você?"
              placeholderTextColor="rgba(255,255,255,0.38)"
              autoCapitalize="words"
              autoCorrect={false}
              autoComplete="name"
              textContentType="name"
              returnKeyType="next"
              value={value}
              onChangeText={(text) => {
                onChange(text);
                clearErrors("root");
              }}
              onBlur={onBlur}
              editable={!busy}
              accessibilityLabel="Nome"
            />
          )}
        />
        {errors.name?.message ? (
          <Text
            className="mt-2 font-golos text-sm text-error"
            accessibilityLiveRegion="polite"
          >
            {errors.name.message}
          </Text>
        ) : null}
      </View>

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
                placeholder="8+ caracteres, com letras e número"
                placeholderTextColor="rgba(255,255,255,0.38)"
                secureTextEntry={!passwordVisible}
                autoComplete="new-password"
                textContentType="newPassword"
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
                accessibilityHint="Use pelo menos oito caracteres, uma letra maiúscula, uma minúscula e um número"
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
