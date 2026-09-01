import { BadRequestError } from "../../errors/index.ts";

import type { ProductListQuery } from "./product.schemas.ts";

export type ProductListFilters = {
  page: number;
  pageSize: number;
  search?: string;
  format?: "vinyl" | "cd" | "cassette";
  edition?: "standard" | "deluxe" | "colored";
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
};

export const normalizeProductListQuery = (
  query: ProductListQuery,
): ProductListFilters => {
  const search = query.search?.trim();

  if (query.search !== undefined && !search) {
    throw new BadRequestError({
      code: "EMPTY_SEARCH",
      message: "The search filter cannot contain only whitespace.",
    });
  }

  const { minPrice, maxPrice } = query;
  if (
    minPrice !== undefined &&
    maxPrice !== undefined &&
    Number(minPrice) > Number(maxPrice)
  ) {
    throw new BadRequestError({
      code: "INVALID_PRICE_RANGE",
      message: "minPrice cannot be greater than maxPrice.",
      details: { minPrice, maxPrice },
    });
  }

  const requestedImported = query.isImported;
  const requestedOnSale = query.onSale;

  if (query.collection === "imported" && requestedImported === false) {
    throw new BadRequestError({
      code: "CONFLICTING_FILTERS",
      message:
        "The imported collection cannot be combined with isImported=false.",
    });
  }

  if (query.collection === "national" && requestedImported === true) {
    throw new BadRequestError({
      code: "CONFLICTING_FILTERS",
      message:
        "The national collection cannot be combined with isImported=true.",
    });
  }

  if (query.collection === "promotions" && requestedOnSale === false) {
    throw new BadRequestError({
      code: "CONFLICTING_FILTERS",
      message:
        "The promotions collection cannot be combined with onSale=false.",
    });
  }

  const collectionSection =
    query.collection === "releases"
      ? "home-releases"
      : query.collection === "recommendations"
        ? "home-recommendations"
        : undefined;

  if (
    collectionSection !== undefined &&
    query.section !== undefined &&
    query.section !== collectionSection
  ) {
    throw new BadRequestError({
      code: "CONFLICTING_FILTERS",
      message: `The ${query.collection} collection requires section=${collectionSection}.`,
    });
  }

  const collectionSort =
    query.collection === "bestsellers"
      ? "best_selling"
      : query.collection === "new"
        ? "newest"
        : undefined;

  return {
    page: query.page ?? 1,
    pageSize: query.pageSize ?? 20,
    search,
    format: query.format,
    edition: query.edition,
    artist: query.artist,
    genre: query.genre,
    category: query.category,
    tag: query.tag,
    section: query.section ?? collectionSection,
    minPrice,
    maxPrice,
    inStock: query.inStock,
    isImported:
      query.collection === "imported"
        ? true
        : query.collection === "national"
          ? false
          : requestedImported,
    onSale: query.collection === "promotions" ? true : requestedOnSale,
    hasSales: query.collection === "bestsellers" ? true : undefined,
    sort: query.sort ?? collectionSort ?? "newest",
  };
};
