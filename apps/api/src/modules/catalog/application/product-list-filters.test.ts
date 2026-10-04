import { describe, expect, it } from "vitest";

import { InvalidProductFilterError } from "../domain/product.errors.ts";
import { normalizeProductListFilters } from "./product-list-filters.ts";

describe("normalizeProductListFilters", () => {
  it("applies default pagination and sorting when input is empty", () => {
    const filters = normalizeProductListFilters({});

    expect(filters).toEqual({
      page: 1,
      pageSize: 20,
      search: undefined,
      format: undefined,
      edition: undefined,
      artist: undefined,
      genre: undefined,
      category: undefined,
      tag: undefined,
      section: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      inStock: undefined,
      isImported: undefined,
      onSale: undefined,
      hasSales: undefined,
      sort: "newest",
    });
  });

  it("trims search string if provided", () => {
    const filters = normalizeProductListFilters({
      search: "  Pink Floyd  ",
    });
    expect(filters.search).toBe("Pink Floyd");
  });

  it("throws InvalidProductFilterError if search is only whitespace", () => {
    expect(() =>
      normalizeProductListFilters({ search: "   " }),
    ).toThrowError(InvalidProductFilterError);

    try {
      normalizeProductListFilters({ search: "   " });
    } catch (error) {
      expect(error).toBeInstanceOf(InvalidProductFilterError);
      expect((error as InvalidProductFilterError).code).toBe("EMPTY_SEARCH");
    }
  });

  it("throws InvalidProductFilterError if minPrice > maxPrice", () => {
    expect(() =>
      normalizeProductListFilters({
        minPrice: "200.00",
        maxPrice: "100.00",
      }),
    ).toThrowError(InvalidProductFilterError);

    try {
      normalizeProductListFilters({
        minPrice: "200.00",
        maxPrice: "100.00",
      });
    } catch (error) {
      expect(error).toBeInstanceOf(InvalidProductFilterError);
      expect((error as InvalidProductFilterError).code).toBe(
        "INVALID_PRICE_RANGE",
      );
    }
  });

  it("accepts valid price range", () => {
    const filters = normalizeProductListFilters({
      minPrice: "50.00",
      maxPrice: "100.00",
    });
    expect(filters.minPrice).toBe("50.00");
    expect(filters.maxPrice).toBe("100.00");
  });

  describe("collection: imported / national", () => {
    it("sets isImported=true for imported collection", () => {
      const filters = normalizeProductListFilters({ collection: "imported" });
      expect(filters.isImported).toBe(true);
    });

    it("rejects collection=imported with isImported=false", () => {
      expect(() =>
        normalizeProductListFilters({
          collection: "imported",
          isImported: false,
        }),
      ).toThrowError(InvalidProductFilterError);
    });

    it("sets isImported=false for national collection", () => {
      const filters = normalizeProductListFilters({ collection: "national" });
      expect(filters.isImported).toBe(false);
    });

    it("rejects collection=national with isImported=true", () => {
      expect(() =>
        normalizeProductListFilters({
          collection: "national",
          isImported: true,
        }),
      ).toThrowError(InvalidProductFilterError);
    });
  });

  describe("collection: promotions", () => {
    it("sets onSale=true for promotions collection", () => {
      const filters = normalizeProductListFilters({
        collection: "promotions",
      });
      expect(filters.onSale).toBe(true);
    });

    it("rejects collection=promotions with onSale=false", () => {
      expect(() =>
        normalizeProductListFilters({
          collection: "promotions",
          onSale: false,
        }),
      ).toThrowError(InvalidProductFilterError);
    });
  });

  describe("collection: releases and recommendations", () => {
    it("sets section to home-releases for releases collection", () => {
      const filters = normalizeProductListFilters({ collection: "releases" });
      expect(filters.section).toBe("home-releases");
    });

    it("sets section to home-recommendations for recommendations", () => {
      const filters = normalizeProductListFilters({
        collection: "recommendations",
      });
      expect(filters.section).toBe("home-recommendations");
    });

    it("rejects a section that conflicts with its collection", () => {
      expect(() =>
        normalizeProductListFilters({
          collection: "releases",
          section: "other-section",
        }),
      ).toThrowError(InvalidProductFilterError);
    });
  });

  describe("collection: bestsellers and new", () => {
    it("sets hasSales=true and sort=best_selling for bestsellers", () => {
      const filters = normalizeProductListFilters({
        collection: "bestsellers",
      });
      expect(filters.hasSales).toBe(true);
      expect(filters.sort).toBe("best_selling");
    });

    it("sets sort=newest for new collection", () => {
      const filters = normalizeProductListFilters({ collection: "new" });
      expect(filters.sort).toBe("newest");
    });

    it("allows explicit sort to override collection default sort", () => {
      const filters = normalizeProductListFilters({
        collection: "bestsellers",
        sort: "price_asc",
      });
      expect(filters.sort).toBe("price_asc");
    });
  });
});
