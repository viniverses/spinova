import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { TextInput } from "@/components/ui/textinput";
import {
  useAddresses,
  useCreateAddress,
  useUpdateAddress,
} from "@/hooks/use-addresses";
import { useLookupCep } from "@/hooks/use-lookup-cep";
import { addressSchema, type AddressFormValues } from "@/schemas/address";

const CONTENT_BOTTOM_PADDING = 24;

const formatCep = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  if (digits.length > 5) {
    return `${digits.slice(0, 5)}-${digits.slice(5)}`;
  }
  return digits;
};

export default function AddressScreen() {
  const router = useRouter();
  const { id, returnTo } = useLocalSearchParams<{
    id?: string;
    returnTo?: string;
  }>();
  const isEditing = Boolean(id);

  const { data: addressesList, isLoading: isLoadingAddresses } = useAddresses({
    enabled: isEditing,
  });
  const createAddress = useCreateAddress();
  const updateAddress = useUpdateAddress();
  const lookupCepMutation = useLookupCep();

  const [cepNotice, setCepNotice] = useState<string | null>(null);
  const isSearchingCep = lookupCepMutation.isPending;
  const lastLoadedCepRef = useRef<string | null>(null);
  const hasInitializedRef = useRef(false);

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      label: "Casa",
      zipCode: "",
      street: "",
      number: "",
      complement: "",
      neighborhood: "",
      city: "",
      state: "",
    },
    mode: "onSubmit",
  });

  // Pre-fill when editing (executa apenas uma vez na inicialização)
  useEffect(() => {
    if (isEditing && addressesList && !hasInitializedRef.current) {
      const existing = addressesList.find((addr) => addr.id === id);
      if (existing) {
        hasInitializedRef.current = true;
        lastLoadedCepRef.current = existing.zipCode.replace(/\D/g, "");
        reset({
          label: existing.label,
          zipCode: formatCep(existing.zipCode),
          street: existing.street,
          number: existing.number,
          complement: existing.complement ?? "",
          neighborhood: existing.neighborhood ?? "",
          city: existing.city,
          state: existing.state,
        });
      }
    }
  }, [id, isEditing, addressesList, reset]);

  // CEP lookup function
  const handleLookupCep = useCallback(
    async (cepRaw: string) => {
      const digits = cepRaw.replace(/\D/g, "");
      if (digits.length !== 8) return;

      setCepNotice(null);
      clearErrors("zipCode");

      try {
        const result = await lookupCepMutation.mutateAsync(digits);
        if (result.logradouro) {
          setValue("street", result.logradouro, { shouldValidate: true });
        }
        if (result.bairro) {
          setValue("neighborhood", result.bairro, { shouldValidate: true });
        }
        if (result.localidade) {
          setValue("city", result.localidade, { shouldValidate: true });
        }
        if (result.uf) {
          setValue("state", result.uf, { shouldValidate: true });
        }

        // Ao trocar para um CEP diferente do que já havia sido carregado anteriormente
        if (lastLoadedCepRef.current && lastLoadedCepRef.current !== digits) {
          setValue("number", "");
          setValue("complement", "");
          clearErrors("number");
        }
        lastLoadedCepRef.current = digits;

        setCepNotice("Endereço preenchido via CEP!");
      } catch (err: unknown) {
        const message =
          err instanceof Error
            ? err.message
            : "Não foi possível localizar o CEP.";
        setError("zipCode", { message });
      }
    },
    [clearErrors, lookupCepMutation, setError, setValue],
  );

  const handleNavigateBack = useCallback(() => {
    if (returnTo) {
      router.replace(returnTo as never);
    } else if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/checkout" as never);
    }
  }, [returnTo, router]);

  const onSubmit = async (values: AddressFormValues) => {
    try {
      const payload = {
        label: values.label.trim(),
        street: values.street.trim(),
        number: values.number.trim(),
        complement: values.complement?.trim() || null,
        neighborhood: values.neighborhood?.trim() || null,
        city: values.city.trim(),
        state: values.state.trim().toUpperCase(),
        zipCode: values.zipCode.replace(/\D/g, ""),
        country: "BR",
      };

      if (isEditing && id) {
        await updateAddress.mutateAsync({ id, payload });
      } else {
        await createAddress.mutateAsync(payload);
      }

      handleNavigateBack();
    } catch (err: unknown) {
      const message =
        isAxiosError<{ error?: { message?: string } }>(err) &&
        err.response?.data?.error?.message
          ? err.response.data.error.message
          : err instanceof Error
            ? err.message
            : "Não foi possível salvar o endereço. Tente novamente.";

      Alert.alert("Erro ao salvar endereço", message);
    }
  };

  const isBusy =
    isSubmitting ||
    createAddress.isPending ||
    updateAddress.isPending ||
    (isEditing && isLoadingAddresses);

  return (
    <View className="flex-1 bg-[#151315]">
      <SafeAreaView className="flex-1" edges={["top", "bottom", "left", "right"]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          className="flex-1"
        >
          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              flexGrow: 1,
              paddingHorizontal: 23,
              paddingBottom: CONTENT_BOTTOM_PADDING,
            }}
          >
            {/* Header */}
            <View className="mt-4 flex-row items-center gap-4">
              <Pressable
                onPress={handleNavigateBack}
                accessibilityRole="button"
                accessibilityLabel="Voltar"
                className="h-12 w-12 items-center justify-center rounded-xl bg-[#272628] active:opacity-75"
              >
                <Ionicons name="chevron-back" size={24} color="#D5D4D7" />
              </Pressable>
              <Text className="font-sans text-2xl text-[#F7F6F7]">
                {isEditing ? "Editar endereço" : "Endereço de entrega"}
              </Text>
            </View>

            <Text className="mt-6 font-golos text-sm text-white/60">
              Informe seu CEP para preencher o endereço automaticamente através
              da base dos Correios.
            </Text>

            {/* Form Fields */}
            <View className="mt-6 gap-4">
              {/* CEP field */}
              <View>
                <Text className="mb-2 font-golos-semibold text-sm text-white/80">
                  CEP *
                </Text>
                <View className="relative justify-center">
                  <Controller
                    control={control}
                    name="zipCode"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        placeholder="00000-000"
                        keyboardType="number-pad"
                        maxLength={9}
                        value={value}
                        onChangeText={(text) => {
                          const formatted = formatCep(text);
                          onChange(formatted);
                          if (formatted.replace(/\D/g, "").length === 8) {
                            handleLookupCep(formatted);
                          }
                        }}
                        onBlur={onBlur}
                        editable={!isBusy}
                        accessibilityLabel="CEP"
                        className="pr-12"
                      />
                    )}
                  />
                  <View className="absolute right-3">
                    {isSearchingCep ? (
                      <ActivityIndicator size="small" color="#E14842" />
                    ) : (
                      <Pressable
                        onPress={() => handleLookupCep(getValues("zipCode"))}
                        hitSlop={8}
                        accessibilityRole="button"
                        accessibilityLabel="Buscar CEP"
                      >
                        <Ionicons
                          name="search-outline"
                          size={20}
                          color="#F7F6F7"
                        />
                      </Pressable>
                    )}
                  </View>
                </View>
                {cepNotice ? (
                  <Text className="mt-1 font-golos text-xs text-green-400">
                    {cepNotice}
                  </Text>
                ) : null}
                {errors.zipCode?.message ? (
                  <Text className="mt-1 font-golos text-sm text-error">
                    {errors.zipCode.message}
                  </Text>
                ) : null}
              </View>

              {/* Logradouro / Rua */}
              <View>
                <Text className="mb-2 font-golos-semibold text-sm text-white/80">
                  Logradouro / Rua *
                </Text>
                <Controller
                  control={control}
                  name="street"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      placeholder="Ex: Av. Paulista, Rua dos Discos"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      editable={!isBusy}
                      accessibilityLabel="Logradouro"
                    />
                  )}
                />
                {errors.street?.message ? (
                  <Text className="mt-1 font-golos text-sm text-error">
                    {errors.street.message}
                  </Text>
                ) : null}
              </View>

              {/* Número e Complemento */}
              <View className="flex-row gap-3">
                <View className="flex-1">
                  <Text className="mb-2 font-golos-semibold text-sm text-white/80">
                    Número *
                  </Text>
                  <Controller
                    control={control}
                    name="number"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        placeholder="123"
                        keyboardType="default"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        editable={!isBusy}
                        accessibilityLabel="Número"
                      />
                    )}
                  />
                  {errors.number?.message ? (
                    <Text className="mt-1 font-golos text-sm text-error">
                      {errors.number.message}
                    </Text>
                  ) : null}
                </View>

                <View className="flex-1">
                  <Text className="mb-2 font-golos-semibold text-sm text-white/80">
                    Complemento
                  </Text>
                  <Controller
                    control={control}
                    name="complement"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        placeholder="Apto, Bloco (opcional)"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        editable={!isBusy}
                        accessibilityLabel="Complemento"
                      />
                    )}
                  />
                </View>
              </View>

              {/* Bairro */}
              <View>
                <Text className="mb-2 font-golos-semibold text-sm text-white/80">
                  Bairro
                </Text>
                <Controller
                  control={control}
                  name="neighborhood"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      placeholder="Ex: Bela Vista, República"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      editable={!isBusy}
                      accessibilityLabel="Bairro"
                    />
                  )}
                />
              </View>

              {/* Cidade e Estado */}
              <View className="flex-row gap-3">
                <View className="flex-[2]">
                  <Text className="mb-2 font-golos-semibold text-sm text-white/80">
                    Cidade *
                  </Text>
                  <Controller
                    control={control}
                    name="city"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        placeholder="São Paulo"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        editable={!isBusy}
                        accessibilityLabel="Cidade"
                      />
                    )}
                  />
                  {errors.city?.message ? (
                    <Text className="mt-1 font-golos text-sm text-error">
                      {errors.city.message}
                    </Text>
                  ) : null}
                </View>

                <View className="flex-1">
                  <Text className="mb-2 font-golos-semibold text-sm text-white/80">
                    UF *
                  </Text>
                  <Controller
                    control={control}
                    name="state"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        placeholder="SP"
                        maxLength={2}
                        autoCapitalize="characters"
                        value={value}
                        onChangeText={(text) => onChange(text.toUpperCase())}
                        onBlur={onBlur}
                        editable={!isBusy}
                        accessibilityLabel="Estado"
                      />
                    )}
                  />
                  {errors.state?.message ? (
                    <Text className="mt-1 font-golos text-sm text-error">
                      {errors.state.message}
                    </Text>
                  ) : null}
                </View>
              </View>

              {/* Identificador (Casa, Trabalho, etc.) */}
              <View>
                <Text className="mb-2 font-golos-semibold text-sm text-white/80">
                  Identificador do endereço *
                </Text>
                <Controller
                  control={control}
                  name="label"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      placeholder="Ex: Casa, Trabalho"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      editable={!isBusy}
                      accessibilityLabel="Identificador"
                    />
                  )}
                />
                {errors.label?.message ? (
                  <Text className="mt-1 font-golos text-sm text-error">
                    {errors.label.message}
                  </Text>
                ) : null}
              </View>

              {/* Save Button */}
              <Pressable
                onPress={handleSubmit(onSubmit)}
                disabled={isBusy}
                accessibilityRole="button"
                accessibilityLabel="Salvar endereço"
                className="mt-6 min-h-[50px] flex-row items-center justify-center gap-2 rounded-[11px] bg-primary px-5 active:opacity-85 disabled:bg-[#4D474E]"
              >
                <Text className="font-sans text-xl text-white">
                  {isBusy ? "Salvando..." : "Salvar endereço"}
                </Text>
                {isBusy ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Ionicons name="checkmark" size={24} color="#FFFFFF" />
                )}
              </Pressable>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
