import { InvalidProductFilterError } from "../domain/product.errors.ts";
import type {
  ProductEdition,
  ProductFormat,
  ProductListFilters,
} from "../domain/product.types.ts";

export type ProductCollection =
  | "bestsellers"
  | "new"
  | "promotions"
  | "imported"
  | "national"
  | "releases"
  | "recommendations";

export interface ProductListInput {
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
  minPrice?: string;
  maxPrice?: string;
  inStock?: boolean;
  isImported?: boolean;
  onSale?: boolean;
  sort?: ProductListFilters["sort"];
}

export const normalizeProductListFilters = (
  input: ProductListInput,
): ProductListFilters => {
  const search = input.search?.trim();

  if (input.search !== undefined && !search) {
    throw new InvalidProductFilterError(
      "EMPTY_SEARCH",
      "The search filter cannot contain only whitespace.",
    );
  }

  const { minPrice, maxPrice } = input;
  if (
    minPrice !== undefined &&
    maxPrice !== undefined &&
    Number(minPrice) > Number(maxPrice)
  ) {
    throw new InvalidProductFilterError(
      "INVALID_PRICE_RANGE",
      "minPrice cannot be greater than maxPrice.",
      { minPrice, maxPrice },
    );
  }

  const requestedImported = input.isImported;
  const requestedOnSale = input.onSale;

  if (input.collection === "imported" && requestedImported === false) {
    throw new InvalidProductFilterError(
      "CONFLICTING_FILTERS",
      "The imported collection cannot be combined with isImported=false.",
    );
  }

  if (input.collection === "national" && requestedImported === true) {
    throw new InvalidProductFilterError(
      "CONFLICTING_FILTERS",
      "The national collection cannot be combined with isImported=true.",
    );
  }

  if (input.collection === "promotions" && requestedOnSale === false) {
    throw new InvalidProductFilterError(
      "CONFLICTING_FILTERS",
      "The promotions collection cannot be combined with onSale=false.",
    );
  }

  const collectionSection =
    input.collection === "releases"
      ? "home-releases"
      : input.collection === "recommendations"
        ? "home-recommendations"
        : undefined;

  if (
    collectionSection !== undefined &&
    input.section !== undefined &&
    input.section !== collectionSection
  ) {
    throw new InvalidProductFilterError(
      "CONFLICTING_FILTERS",
      `The ${input.collection} collection requires section=${collectionSection}.`,
    );
  }

  const collectionSort =
    input.collection === "bestsellers"
      ? "best_selling"
      : input.collection === "new"
        ? "newest"
        : undefined;

  return {
    page: input.page ?? 1,
    pageSize: input.pageSize ?? 20,
    search,
    format: input.format,
    edition: input.edition,
    artist: input.artist,
    genre: input.genre,
    category: input.category,
    tag: input.tag,
    section: input.section ?? collectionSection,
    minPrice,
    maxPrice,
    inStock: input.inStock,
    isImported:
      input.collection === "imported"
        ? true
        : input.collection === "national"
          ? false
          : requestedImported,
    onSale: input.collection === "promotions" ? true : requestedOnSale,
    hasSales: input.collection === "bestsellers" ? true : undefined,
    sort: input.sort ?? collectionSort ?? "newest",
  };
};
