import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authClient } from "../lib/auth-client";

export const useSession = authClient.useSession;

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { error } = await authClient.signOut();
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.clear();
    },
    onError: (error) => {
      console.error("Erro ao deslogar:", error);
    },
  });
};
