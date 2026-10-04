import { Ionicons } from "@expo/vector-icons";
import { Controller, useFormContext } from "react-hook-form";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

import { TextInput } from "@/components/ui/textinput";
import type { AddressFormValues } from "@/schemas/address";
import { formatCep } from "@/utils";

export function AddressCepField({
  disabled,
  isSearching,
  notice,
  onLookup,
}: {
  disabled: boolean;
  isSearching: boolean;
  notice: string | null;
  onLookup: (cep: string) => void;
}) {
  const {
    control,
    getValues,
    formState: { errors },
  } = useFormContext<AddressFormValues>();

  return (
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
                  onLookup(formatted);
                }
              }}
              onBlur={onBlur}
              editable={!disabled}
              accessibilityLabel="CEP"
              className="pr-12"
            />
          )}
        />
        <View className="absolute right-3">
          {isSearching ? (
            <ActivityIndicator size="small" color="#E14842" />
          ) : (
            <Pressable
              onPress={() => onLookup(getValues("zipCode"))}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Buscar CEP"
            >
              <Ionicons name="search-outline" size={20} color="#F7F6F7" />
            </Pressable>
          )}
        </View>
      </View>
      {notice ? (
        <Text className="mt-1 font-golos text-xs text-green-400">{notice}</Text>
      ) : null}
      {errors.zipCode?.message ? (
        <Text className="mt-1 font-golos text-sm text-error">
          {errors.zipCode.message}
        </Text>
      ) : null}
    </View>
  );
}
