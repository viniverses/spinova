import { api } from "./api";

export type CompletedOrder = {
  id: string;
  status: "pending";
  total: string;
  currency: "BRL";
  createdAt: string;
};

export const completeCheckout = async (): Promise<CompletedOrder> => {
  const { data } = await api.post<{ data: CompletedOrder }>("/orders");
  return data.data;
};
