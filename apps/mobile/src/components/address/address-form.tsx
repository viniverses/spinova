import { Ionicons } from "@expo/vector-icons";
import { FormProvider, useFormContext } from "react-hook-form";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

import { AddressCepField } from "@/components/address/address-cep-field";
import { FormField } from "@/components/ui/form-field";
import { useAddressEditor } from "@/hooks/use-address-editor";
import type { AddressFormValues } from "@/schemas/address";

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
  const { control } = useFormContext<AddressFormValues>();

  return (
    <View className="mt-6 gap-4">
      <AddressCepField
        disabled={isBusy}
        isSearching={isSearchingCep}
        notice={cepNotice}
        onLookup={lookupCep}
      />

      <FormField
        control={control}
        name="street"
        label="Logradouro / Rua *"
        placeholder="Ex: Av. Paulista, Rua dos Discos"
        accessibilityLabel="Logradouro"
        disabled={isBusy}
      />

      <View className="flex-row gap-3">
        <View className="flex-1">
          <FormField
            control={control}
            name="number"
            label="Número *"
            placeholder="123"
            accessibilityLabel="Número"
            keyboardType="default"
            disabled={isBusy}
          />
        </View>
        <View className="flex-1">
          <FormField
            control={control}
            name="complement"
            label="Complemento"
            placeholder="Apto, Bloco (opcional)"
            accessibilityLabel="Complemento"
            disabled={isBusy}
          />
        </View>
      </View>

      <FormField
        control={control}
        name="neighborhood"
        label="Bairro"
        placeholder="Ex: Bela Vista, República"
        accessibilityLabel="Bairro"
        disabled={isBusy}
      />

      <View className="flex-row gap-3">
        <View className="flex-[2]">
          <FormField
            control={control}
            name="city"
            label="Cidade *"
            placeholder="São Paulo"
            accessibilityLabel="Cidade"
            disabled={isBusy}
          />
        </View>
        <View className="flex-1">
          <FormField
            control={control}
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

      <FormField
        control={control}
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
