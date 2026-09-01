import { RepositoryError } from "../../errors/index.ts";
import {
  albums,
  artists,
  categories,
  db,
  featuredItems,
  featuredSections,
  orderItems,
  productCategories,
  productImages,
  products,
  productTags,
  reviews,
} from "@repo/database";
import {
  and,
  asc,
  count,
  desc,
  eq,
  gt,
  gte,
  ilike,
  isNotNull,
  isNull,
  lte,
  or,
  sql,
  type SQL,
} from "@repo/database/query";

import type { ProductListFilters } from "./product.filters.ts";

const primaryImage = db
  .select({
    productId: productImages.productId,
    url: productImages.url,
    altText: productImages.altText,
  })
  .from(productImages)
  .where(eq(productImages.position, 0))
  .as("primary_product_image");

const productSales = db
  .select({
    productId: orderItems.productId,
    unitsSold: sql<number>`sum(${orderItems.quantity})::integer`.as(
      "units_sold",
    ),
  })
  .from(orderItems)
  .groupBy(orderItems.productId)
  .as("product_sales");

const productRatings = db
  .select({
    productId: reviews.productId,
    average: sql<number>`avg(${reviews.rating})::double precision`.as(
      "rating_average",
    ),
    count: sql<number>`count(${reviews.id})::integer`.as("rating_count"),
  })
  .from(reviews)
  .groupBy(reviews.productId)
  .as("product_ratings");

const buildConditions = (filters: ProductListFilters) => {
  const conditions: SQL[] = [];

  if (filters.search) {
    const search = `%${filters.search}%`;
    conditions.push(
      or(
        ilike(albums.title, search),
        ilike(artists.name, search),
        ilike(products.sku, search),
      )!,
    );
  }

  if (filters.format) conditions.push(eq(products.format, filters.format));
  if (filters.edition) conditions.push(eq(products.edition, filters.edition));
  if (filters.artist) conditions.push(eq(artists.slug, filters.artist));
  if (filters.genre) {
    conditions.push(sql`lower(${albums.genre}) = lower(${filters.genre})`);
  }
  if (filters.minPrice) conditions.push(gte(products.price, filters.minPrice));
  if (filters.maxPrice) conditions.push(lte(products.price, filters.maxPrice));

  if (filters.inStock !== undefined) {
    conditions.push(
      filters.inStock
        ? gt(products.stockQuantity, 0)
        : eq(products.stockQuantity, 0),
    );
  }

  if (filters.isImported !== undefined) {
    conditions.push(eq(products.isImported, filters.isImported));
  }

  if (filters.onSale !== undefined) {
    conditions.push(
      filters.onSale
        ? isNotNull(products.compareAtPrice)
        : isNull(products.compareAtPrice),
    );
  }

  if (filters.category) {
    conditions.push(sql`exists (
      select 1
      from ${productCategories}
      inner join ${categories}
        on ${categories.id} = ${productCategories.categoryId}
      where ${productCategories.productId} = ${products.id}
        and ${categories.slug} = ${filters.category}
    )`);
  }

  if (filters.tag) {
    conditions.push(sql`exists (
      select 1
      from ${productTags}
      where ${productTags.productId} = ${products.id}
        and lower(${productTags.tag}) = lower(${filters.tag})
    )`);
  }

  if (filters.section) {
    conditions.push(sql`exists (
      select 1
      from ${featuredItems}
      inner join ${featuredSections}
        on ${featuredSections.id} = ${featuredItems.sectionId}
      where ${featuredItems.productId} = ${products.id}
        and ${featuredSections.slug} = ${filters.section}
        and (${featuredSections.activeFrom} is null or ${featuredSections.activeFrom} <= now())
        and (${featuredSections.activeTo} is null or ${featuredSections.activeTo} > now())
    )`);
  }

  if (filters.hasSales) {
    conditions.push(sql`exists (
      select 1
      from ${orderItems}
      where ${orderItems.productId} = ${products.id}
    )`);
  }

  return conditions;
};

const buildOrderBy = (sort: ProductListFilters["sort"]): SQL[] => {
  switch (sort) {
    case "price_asc":
      return [asc(products.price), asc(products.id)];
    case "price_desc":
      return [desc(products.price), asc(products.id)];
    case "title_asc":
      return [asc(albums.title), asc(products.id)];
    case "best_selling":
      return [
        desc(sql`coalesce(${productSales.unitsSold}, 0)`),
        desc(products.createdAt),
        asc(products.id),
      ];
    case "newest":
    default:
      return [desc(products.createdAt), asc(products.id)];
  }
};

const productListSelection = {
  id: products.id,
  albumId: albums.id,
  title: albums.title,
  artistId: artists.id,
  artistName: artists.name,
  artistSlug: artists.slug,
  sku: products.sku,
  format: products.format,
  edition: products.edition,
  price: products.price,
  compareAtPrice: products.compareAtPrice,
  stockQuantity: products.stockQuantity,
  isImported: products.isImported,
  genre: albums.genre,
  releaseDate: albums.releaseDate,
  description: albums.description,
  imageUrl: primaryImage.url,
  imageAltText: primaryImage.altText,
  ratingAverage: productRatings.average,
  ratingCount: productRatings.count,
  unitsSold: productSales.unitsSold,
  createdAt: products.createdAt,
};

const mapProductListItem = (row: {
  id: string;
  albumId: string;
  title: string;
  artistId: string;
  artistName: string;
  artistSlug: string;
  sku: string;
  format: "vinyl" | "cd" | "cassette";
  edition: "standard" | "deluxe" | "colored";
  price: string;
  compareAtPrice: string | null;
  stockQuantity: number;
  isImported: boolean;
  genre: string | null;
  releaseDate: string | null;
  imageUrl: string | null;
  imageAltText: string | null;
  ratingAverage: number | null;
  ratingCount: number | null;
  unitsSold: number | null;
  createdAt: Date;
}) => ({
  id: row.id,
  albumId: row.albumId,
  title: row.title,
  artist: {
    id: row.artistId,
    name: row.artistName,
    slug: row.artistSlug,
  },
  sku: row.sku,
  format: row.format,
  edition: row.edition,
  price: row.price,
  compareAtPrice: row.compareAtPrice,
  currency: "BRL" as const,
  stockQuantity: row.stockQuantity,
  inStock: row.stockQuantity > 0,
  isImported: row.isImported,
  genre: row.genre,
  releaseDate: row.releaseDate,
  image:
    row.imageUrl === null
      ? null
      : { url: row.imageUrl, altText: row.imageAltText },
  rating: {
    average:
      row.ratingAverage === null
        ? null
        : Math.round(Number(row.ratingAverage) * 10) / 10,
    count: Number(row.ratingCount ?? 0),
  },
  unitsSold: Number(row.unitsSold ?? 0),
  createdAt: row.createdAt.toISOString(),
});

export const listProducts = async (filters: ProductListFilters) => {
  try {
    const conditions = buildConditions(filters);
    const where = and(...conditions);
    const offset = (filters.page - 1) * filters.pageSize;

    const [rows, countRows] = await Promise.all([
      db
        .select(productListSelection)
        .from(products)
        .innerJoin(albums, eq(albums.id, products.albumId))
        .innerJoin(artists, eq(artists.id, albums.artistId))
        .leftJoin(primaryImage, eq(primaryImage.productId, products.id))
        .leftJoin(productSales, eq(productSales.productId, products.id))
        .leftJoin(productRatings, eq(productRatings.productId, products.id))
        .where(where)
        .orderBy(...buildOrderBy(filters.sort))
        .limit(filters.pageSize)
        .offset(offset),
      db
        .select({ total: count() })
        .from(products)
        .innerJoin(albums, eq(albums.id, products.albumId))
        .innerJoin(artists, eq(artists.id, albums.artistId))
        .where(where),
    ]);

    const totalItems = Number(countRows[0]?.total ?? 0);
    const totalPages = Math.ceil(totalItems / filters.pageSize);

    return {
      data: rows.map(mapProductListItem),
      pagination: {
        page: filters.page,
        pageSize: filters.pageSize,
        totalItems,
        totalPages,
      },
    };
  } catch (error) {
    throw new RepositoryError("list", "products", error);
  }
};

export const findProductById = async (id: string) => {
  try {
    const rows = await db
      .select(productListSelection)
      .from(products)
      .innerJoin(albums, eq(albums.id, products.albumId))
      .innerJoin(artists, eq(artists.id, albums.artistId))
      .leftJoin(primaryImage, eq(primaryImage.productId, products.id))
      .leftJoin(productSales, eq(productSales.productId, products.id))
      .leftJoin(productRatings, eq(productRatings.productId, products.id))
      .where(eq(products.id, id))
      .limit(1);

    const row = rows[0];
    if (!row) return null;

    const [images, tags, productCategoryRows] = await Promise.all([
      db
        .select({
          url: productImages.url,
          position: productImages.position,
          altText: productImages.altText,
        })
        .from(productImages)
        .where(eq(productImages.productId, id))
        .orderBy(asc(productImages.position)),
      db
        .select({ tag: productTags.tag })
        .from(productTags)
        .where(eq(productTags.productId, id))
        .orderBy(asc(productTags.tag)),
      db
        .select({
          id: categories.id,
          name: categories.name,
          slug: categories.slug,
          type: categories.type,
        })
        .from(productCategories)
        .innerJoin(categories, eq(categories.id, productCategories.categoryId))
        .where(eq(productCategories.productId, id))
        .orderBy(asc(categories.name)),
    ]);

    return {
      data: {
        ...mapProductListItem(row),
        description: row.description,
        images,
        tags: tags.map(({ tag }) => tag),
        categories: productCategoryRows,
      },
    };
  } catch (error) {
    throw new RepositoryError("find", "products", error);
  }
};
