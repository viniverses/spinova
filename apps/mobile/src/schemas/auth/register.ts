import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres."),
  email: z
    .string()
    .min(1, "Informe o email.")
    .email("Informe um email válido."),
  password: z
    .string()
    .min(8, "A senha deve ter pelo menos 8 caracteres.")
    .regex(/[a-z]/, "A senha deve conter pelo menos uma letra minúscula.")
    .regex(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula.")
    .regex(/[0-9]/, "A senha deve conter pelo menos um número."),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;
