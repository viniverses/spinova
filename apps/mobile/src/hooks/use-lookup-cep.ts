import { useMutation, useQueryClient } from "@tanstack/react-query";
import { lookupCep, type ViaCepResponse } from "@/services/addresses";

export const cepQueryKey = (cleanedCep: string) => ["cep", cleanedCep] as const;

export const useLookupCep = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (cep: string): Promise<ViaCepResponse> => {
      const cleaned = cep.replace(/\D/g, "");
      if (cleaned.length !== 8) {
        throw new Error("CEP deve conter 8 dígitos.");
      }

      return queryClient.query({
        queryKey: cepQueryKey(cleaned),
        queryFn: () => lookupCep(cleaned),
        staleTime: 1000 * 60 * 60 * 24, // 24 horas de cache
      });
    },
  });
};
