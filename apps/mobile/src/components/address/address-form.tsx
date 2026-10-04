import { Ionicons } from "@expo/vector-icons";
import { Controller, FormProvider, useFormContext } from "react-hook-form";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

import { AddressCepField } from "@/components/address/address-cep-field";
import { TextInput, type TextInputProps } from "@/components/ui/textinput";
import { useAddressEditor } from "@/hooks/use-address-editor";
import type { AddressFormValues } from "@/schemas/address";

type FieldName = Exclude<keyof AddressFormValues, "zipCode">;

type AddressFieldProps = {
  name: FieldName;
  label: string;
  placeholder: string;
  accessibilityLabel: string;
  disabled: boolean;
  keyboardType?: TextInputProps["keyboardType"];
  maxLength?: number;
  autoCapitalize?: TextInputProps["autoCapitalize"];
  transform?: (value: string) => string;
};

function AddressField({
  name,
  label,
  placeholder,
  accessibilityLabel,
  disabled,
  keyboardType,
  maxLength,
  autoCapitalize,
  transform,
}: AddressFieldProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext<AddressFormValues>();

  return (
    <View>
      <Text className="mb-2 font-golos-semibold text-sm text-white/80">
        {label}
      </Text>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            placeholder={placeholder}
            keyboardType={keyboardType}
            maxLength={maxLength}
            autoCapitalize={autoCapitalize}
            value={value}
            onChangeText={(text) =>
              onChange(transform ? transform(text) : text)
            }
            onBlur={onBlur}
            editable={!disabled}
            accessibilityLabel={accessibilityLabel}
          />
        )}
      />
      {errors[name]?.message ? (
        <Text className="mt-1 font-golos text-sm text-error">
          {errors[name]?.message}
        </Text>
      ) : null}
    </View>
  );
}

function AddressFields({
  isBusy,
  isSearchingCep,
  cepNotice,
  lookupCep,
  onSave,
}: {
  isBusy: boolean;
  isSearchingCep: boolean;
  cepNotice: string | null;
  lookupCep: (cep: string) => void;
  onSave: () => void;
}) {
  return (
    <View className="mt-6 gap-4">
      <AddressCepField
        disabled={isBusy}
        isSearching={isSearchingCep}
        notice={cepNotice}
        onLookup={lookupCep}
      />

      <AddressField
        name="street"
        label="Logradouro / Rua *"
        placeholder="Ex: Av. Paulista, Rua dos Discos"
        accessibilityLabel="Logradouro"
        disabled={isBusy}
      />

      <View className="flex-row gap-3">
        <View className="flex-1">
          <AddressField
            name="number"
            label="Número *"
            placeholder="123"
            accessibilityLabel="Número"
            keyboardType="default"
            disabled={isBusy}
          />
        </View>
        <View className="flex-1">
          <AddressField
            name="complement"
            label="Complemento"
            placeholder="Apto, Bloco (opcional)"
            accessibilityLabel="Complemento"
            disabled={isBusy}
          />
        </View>
      </View>

      <AddressField
        name="neighborhood"
        label="Bairro"
        placeholder="Ex: Bela Vista, República"
        accessibilityLabel="Bairro"
        disabled={isBusy}
      />

      <View className="flex-row gap-3">
        <View className="flex-[2]">
          <AddressField
            name="city"
            label="Cidade *"
            placeholder="São Paulo"
            accessibilityLabel="Cidade"
            disabled={isBusy}
          />
        </View>
        <View className="flex-1">
          <AddressField
            name="state"
            label="UF *"
            placeholder="SP"
            accessibilityLabel="Estado"
            maxLength={2}
            autoCapitalize="characters"
            transform={(text) => text.toUpperCase()}
            disabled={isBusy}
          />
        </View>
      </View>

      <AddressField
        name="label"
        label="Identificador do endereço *"
        placeholder="Ex: Casa, Trabalho"
        accessibilityLabel="Identificador"
        disabled={isBusy}
      />

      <Pressable
        onPress={onSave}
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
  );
}

export function AddressForm({
  id,
  onSaved,
}: {
  id?: string;
  onSaved: () => void;
}) {
  const editor = useAddressEditor({ id, onSaved });

  return (
    <FormProvider {...editor.form}>
      <AddressFields
        isBusy={editor.isBusy}
        isSearchingCep={editor.isSearchingCep}
        cepNotice={editor.cepNotice}
        lookupCep={editor.lookupCep}
        onSave={editor.form.handleSubmit(editor.save)}
      />
    </FormProvider>
  );
}
