import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createAddress,
  deleteAddress,
  getAddresses,
  getDefaultAddress,
  updateAddress,
  type CreateAddressInput,
  type UpdateAddressInput,
} from "@/services/addresses";

export const addressesQueryKey = ["addresses"] as const;
export const defaultAddressQueryKey = ["addresses", "default"] as const;

export const useAddresses = (options?: { enabled?: boolean }) =>
  useQuery({
    queryKey: addressesQueryKey,
    queryFn: getAddresses,
    ...options,
  });

export const useDefaultAddress = () =>
  useQuery({
    queryKey: defaultAddressQueryKey,
    queryFn: getDefaultAddress,
  });

export const useCreateAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateAddressInput) => createAddress(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: addressesQueryKey });
      void queryClient.invalidateQueries({ queryKey: defaultAddressQueryKey });
    },
  });
};

export const useUpdateAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateAddressInput;
    }) => updateAddress(id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: addressesQueryKey });
      void queryClient.invalidateQueries({ queryKey: defaultAddressQueryKey });
    },
  });
};

export const useDeleteAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteAddress(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: addressesQueryKey });
      void queryClient.invalidateQueries({ queryKey: defaultAddressQueryKey });
    },
  });
};

export { useLookupCep } from "./use-lookup-cep";
