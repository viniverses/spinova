import { z } from "zod";

export const addressSchema = z.object({
  label: z.string().min(1, "Informe um identificador (ex: Casa, Trabalho)."),
  zipCode: z
    .string()
    .min(1, "Informe o CEP.")
    .regex(/^\d{5}-?\d{3}$/, "Informe um CEP válido no formato 00000-000."),
  street: z.string().min(1, "Informe o logradouro / rua."),
  number: z.string().min(1, "Informe o número."),
  complement: z.string().optional(),
  neighborhood: z.string().optional(),
  city: z.string().min(1, "Informe a cidade."),
  state: z
    .string()
    .min(1, "Informe o estado (UF).")
    .length(2, "Informe a sigla do estado com 2 letras (ex: SP)."),
});

export type AddressFormValues = z.infer<typeof addressSchema>;
