import { api } from "./api";

export type OrderStatus =
  | "pending"
  | "paid"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export type CompletedOrder = {
  id: string;
  status: OrderStatus;
  total: string;
  currency: "BRL";
  createdAt: string;
};

export type OrderAddress = {
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
};

export type OrderItemProduct = {
  id: string;
  title: string;
  artist: {
    name: string;
  };
  format: "vinyl" | "cd" | "cassette";
  image: {
    url: string;
    altText: string | null;
  } | null;
};

export type OrderItem = {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: string;
  product: OrderItemProduct;
};

export type Order = {
  id: string;
  status: OrderStatus;
  total: string;
  currency: "BRL";
  createdAt: string;
  itemsCount: number;
  items: OrderItem[];
  address: OrderAddress;
};

export type OrdersPagination = {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
};

export type OrdersResponse = {
  data: Order[];
  pagination: OrdersPagination;
};

export const completeCheckout = async (): Promise<CompletedOrder> => {
  const { data } = await api.post<{ data: CompletedOrder }>("/orders");
  return data.data;
};

export const getOrders = async (
  page = 1,
  pageSize = 20,
): Promise<OrdersResponse> => {
  const { data } = await api.get<OrdersResponse>("/orders", {
    params: { page, pageSize },
  });
  return data;
};

export const getOrderById = async (id: string): Promise<Order> => {
  const { data } = await api.get<{ data: Order }>(`/orders/${id}`);
  return data.data;
};
