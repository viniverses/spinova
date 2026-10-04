import type {
  ProductEdition,
  ProductFormat,
  ProductImage,
  ProductSummary,
} from "./product-summary.ts";

export type {
  ArtistSummary,
  ProductEdition,
  ProductFormat,
  ProductImage,
} from "./product-summary.ts";

export interface ProductGalleryImage extends ProductImage {
  position: number;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  type: "genre" | "tag" | "curated";
}

export interface ProductRating {
  average: number | null;
  count: number;
}

export type ProductCatalogItem = ProductSummary;

export interface ProductDetail extends ProductSummary {
  images: ProductGalleryImage[];
  description: string | null;
  tags: string[];
  categories: ProductCategory[];
  rating: ProductRating;
  unitsSold: number;
  createdAt: string;
}

import type { Pagination } from "../../../shared/contracts/pagination.ts";

export type { Pagination };

export interface ProductCatalogPage {
  items: ProductCatalogItem[];
  pagination: Pagination;
}

export interface ProductListFilters {
  page: number;
  pageSize: number;
  search?: string;
  format?: ProductFormat;
  edition?: ProductEdition;
  artist?: string;
  genre?: string;
  category?: string;
  tag?: string;
  section?: string;
  minPrice?: string;
  maxPrice?: string;
  inStock?: boolean;
  isImported?: boolean;
  onSale?: boolean;
  hasSales?: boolean;
  sort: "newest" | "price_asc" | "price_desc" | "title_asc" | "best_selling";
}
