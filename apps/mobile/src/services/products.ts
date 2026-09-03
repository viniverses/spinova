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

export type ProductImage = {
  url: string;
  altText: string | null;
};

export type ProductCatalogItem = {
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
  image: ProductImage | null;
};

export type ProductRating = {
  average: number | null;
  count: number;
};

export type ProductCategory = {
  id: string;
  name: string;
  slug: string;
  type: "genre" | "tag" | "curated";
};

export type ProductDetail = ProductCatalogItem & {
  images: Array<ProductImage & { position: number }>;
  description: string | null;
  tags: string[];
  categories: ProductCategory[];
  rating: ProductRating;
  unitsSold: number;
  createdAt: string;
};

export type ProductListResponse = {
  data: ProductCatalogItem[];
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
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
