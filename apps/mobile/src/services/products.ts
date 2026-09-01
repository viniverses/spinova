import { api } from "./api";

export type ProductFormat = "vinyl" | "cd" | "cassette";
export type ProductEdition = "standard" | "deluxe" | "colored";
export type ProductCollection =
  | "bestsellers"
  | "new"
  | "promotions"
  | "imported"
  | "national"
  | "releases"
  | "recommendations";
export type ProductSort =
  "newest" | "price_asc" | "price_desc" | "title_asc" | "best_selling";

export type ProductListParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  format?: ProductFormat;
  edition?: ProductEdition;
  artist?: string;
  genre?: string;
  category?: string;
  tag?: string;
  section?: string;
  collection?: ProductCollection;
  minPrice?: number | string;
  maxPrice?: number | string;
  inStock?: boolean;
  isImported?: boolean;
  onSale?: boolean;
  sort?: ProductSort;
};

export type ProductListItem = {
  id: string;
  albumId: string;
  title: string;
  artist: {
    id: string;
    name: string;
    slug: string;
  };
  sku: string;
  format: ProductFormat;
  edition: ProductEdition;
  price: string;
  compareAtPrice: string | null;
  currency: "BRL";
  stockQuantity: number;
  inStock: boolean;
  isImported: boolean;
  genre: string | null;
  releaseDate: string | null;
  image: {
    url: string;
    altText: string | null;
  } | null;
  rating: {
    average: number | null;
    count: number;
  };
  unitsSold: number;
  createdAt: string;
};

export type ProductListResponse = {
  data: ProductListItem[];
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
};

export type ProductDetail = ProductListItem & {
  description: string | null;
  images: Array<{
    url: string;
    position: number;
    altText: string | null;
  }>;
  tags: string[];
  categories: Array<{
    id: string;
    name: string;
    slug: string;
    type: "genre" | "tag" | "curated";
  }>;
};

export const getProducts = async (params: ProductListParams = {}) => {
  const { data } = await api.get<ProductListResponse>("/products", { params });

  return data;
};

export const getProductById = async (productId: string) => {
  const { data } = await api.get<{ data: ProductDetail }>(
    `/products/${encodeURIComponent(productId)}`,
  );

  return data.data;
};
