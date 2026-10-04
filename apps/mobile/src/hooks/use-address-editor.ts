import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Alert } from "react-native";

import {
  useAddresses,
  useCreateAddress,
  useUpdateAddress,
} from "@/hooks/use-addresses";
import { useLookupCep } from "@/hooks/use-lookup-cep";
import { addressSchema, type AddressFormValues } from "@/schemas/address";
import type { Address, CreateAddressInput } from "@/services/addresses";
import { formatCep } from "@/utils";

const DEFAULT_VALUES: AddressFormValues = {
  label: "Casa",
  zipCode: "",
  street: "",
  number: "",
  complement: "",
  neighborhood: "",
  city: "",
  state: "",
};

const toFormValues = (address: Address): AddressFormValues => ({
  label: address.label,
  zipCode: formatCep(address.zipCode),
  street: address.street,
  number: address.number,
  complement: address.complement ?? "",
  neighborhood: address.neighborhood ?? "",
  city: address.city,
  state: address.state,
});

const toPayload = (values: AddressFormValues): CreateAddressInput => ({
  label: values.label.trim(),
  street: values.street.trim(),
  number: values.number.trim(),
  complement: values.complement?.trim() || null,
  neighborhood: values.neighborhood?.trim() || null,
  city: values.city.trim(),
  state: values.state.trim().toUpperCase(),
  zipCode: values.zipCode.replace(/\D/g, ""),
  country: "BR",
});

export function useAddressEditor({
  id,
  onSaved,
}: {
  id?: string;
  onSaved: () => void;
}) {
  const isEditing = Boolean(id);
  const { data: addressesList, isLoading: isLoadingAddresses } = useAddresses({
    enabled: isEditing,
  });
  const createAddress = useCreateAddress();
  const updateAddress = useUpdateAddress();
  const lookupCepMutation = useLookupCep();

  const [cepNotice, setCepNotice] = useState<string | null>(null);
  const lastLoadedCepRef = useRef<string | null>(null);
  const hasInitializedRef = useRef(false);

  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: DEFAULT_VALUES,
    mode: "onSubmit",
  });
  const { clearErrors, reset, setError, setValue } = form;

  useEffect(() => {
    if (!isEditing || !addressesList || hasInitializedRef.current) return;

    const existing = addressesList.find((address) => address.id === id);
    if (!existing) return;

    hasInitializedRef.current = true;
    lastLoadedCepRef.current = existing.zipCode.replace(/\D/g, "");
    reset(toFormValues(existing));
  }, [addressesList, id, isEditing, reset]);

  const lookupCep = useCallback(
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

        if (lastLoadedCepRef.current && lastLoadedCepRef.current !== digits) {
          setValue("number", "");
          setValue("complement", "");
          clearErrors("number");
        }
        lastLoadedCepRef.current = digits;
        setCepNotice("Endereço preenchido via CEP!");
      } catch (error: unknown) {
        const message =
          error instanceof Error
            ? error.message
            : "Não foi possível localizar o CEP.";
        setError("zipCode", { message });
      }
    },
    [clearErrors, lookupCepMutation, setError, setValue],
  );

  const save = async (values: AddressFormValues) => {
    try {
      const payload = toPayload(values);
      if (id) {
        await updateAddress.mutateAsync({ id, payload });
      } else {
        await createAddress.mutateAsync(payload);
      }
      onSaved();
    } catch (error: unknown) {
      const message =
        isAxiosError<{ error?: { message?: string } }>(error) &&
        error.response?.data?.error?.message
          ? error.response.data.error.message
          : error instanceof Error
            ? error.message
            : "Não foi possível salvar o endereço. Tente novamente.";
      Alert.alert("Erro ao salvar endereço", message);
    }
  };

  const isBusy =
    form.formState.isSubmitting ||
    createAddress.isPending ||
    updateAddress.isPending ||
    (isEditing && isLoadingAddresses);

  return {
    form,
    isBusy,
    isSearchingCep: lookupCepMutation.isPending,
    cepNotice,
    lookupCep,
    save,
  };
}
