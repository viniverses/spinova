import axios, { isAxiosError } from "axios";
import { api } from "./api";

export type Address = {
  id: string;
  label: string;
  street: string;
  number: string;
  complement: string | null;
  neighborhood: string | null;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
};

export type CreateAddressInput = {
  label: string;
  street: string;
  number: string;
  complement?: string | null;
  neighborhood?: string | null;
  city: string;
  state: string;
  zipCode: string;
  country?: string;
};

export type UpdateAddressInput = Partial<CreateAddressInput>;

export type ViaCepResponse = {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean | string;
};

export const getAddresses = async (): Promise<Address[]> => {
  const { data } = await api.get<{ data: Address[] }>("/addresses");
  return data.data;
};

export const getDefaultAddress = async (): Promise<Address | null> => {
  try {
    const { data } = await api.get<{ data: Address }>("/addresses/default");
    return data.data;
  } catch (error: unknown) {
    if (isAxiosError(error) && error.response?.status === 404) {
      return null;
    }
    throw error;
  }
};

export const createAddress = async (
  payload: CreateAddressInput,
): Promise<Address> => {
  const { data } = await api.post<{ data: Address }>("/addresses", payload);
  return data.data;
};

export const updateAddress = async (
  id: string,
  payload: UpdateAddressInput,
): Promise<Address> => {
  const { data } = await api.patch<{ data: Address }>(
    `/addresses/${encodeURIComponent(id)}`,
    payload,
  );
  return data.data;
};

export const deleteAddress = async (id: string): Promise<void> => {
  await api.delete(`/addresses/${encodeURIComponent(id)}`);
};

export const lookupCep = async (cep: string): Promise<ViaCepResponse> => {
  const cleaned = cep.replace(/\D/g, "");
  if (cleaned.length !== 8) {
    throw new Error("CEP deve conter 8 dígitos.");
  }

  const { data } = await axios.get<ViaCepResponse>(
    `https://viacep.com.br/ws/${cleaned}/json/`,
    { timeout: 8000 },
  );

  if (data.erro === true || data.erro === "true") {
    throw new Error("CEP não encontrado.");
  }

  return data;
};
