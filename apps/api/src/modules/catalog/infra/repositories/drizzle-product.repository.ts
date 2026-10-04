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
} from "@spinova/database";
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
} from "@spinova/database/query";

import type {
  ProductCatalogPage,
  ProductDetail,
  ProductListFilters,
} from "../../domain/product.types.ts";
import type { IProductRepository } from "../../domain/repositories/product.repository.interface.ts";
import {
  mapProductCatalogItem,
  primaryImageJoinCondition,
  productCatalogSelection,
  type ProductCatalogRow,
} from "../../../../database/read-models/product-catalog.read-model.ts";

const createProductSalesSubquery = () =>
  db
    .select({
      productId: orderItems.productId,
      unitsSold: sql<number>`sum(${orderItems.quantity})::integer`.as(
        "units_sold",
      ),
    })
    .from(orderItems)
    .groupBy(orderItems.productId)
    .as("product_sales");

const buildConditions = (filters: ProductListFilters) => {
  const conditions: SQL[] = [];

  if (filters.search) {
    const sanitized = filters.search.replace(/[%_\\]/g, "\\$&");
    const search = `%${sanitized}%`;
    conditions.push(
      or(
        ilike(albums.title, search),
        ilike(artists.name, search),
        ilike(products.sku, search),
        ilike(sql<string>`${artists.name} || ' ' || ${albums.title}`, search),
        ilike(sql<string>`${albums.title} || ' ' || ${artists.name}`, search),
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

const buildOrderBy = (
  sort: ProductListFilters["sort"],
  productSalesSubquery?: Pick<
    ReturnType<typeof createProductSalesSubquery>,
    "unitsSold"
  >,
): SQL[] => {
  switch (sort) {
    case "price_asc":
      return [asc(products.price), asc(products.id)];
    case "price_desc":
      return [desc(products.price), asc(products.id)];
    case "title_asc":
      return [asc(albums.title), asc(products.id)];
    case "best_selling":
      return [
        desc(sql`coalesce(${productSalesSubquery?.unitsSold}, 0)`),
        desc(products.createdAt),
        asc(products.id),
      ];
    case "newest":
    default:
      return [desc(products.createdAt), asc(products.id)];
  }
};

const productDetailSelection = {
  ...productCatalogSelection,
  description: albums.description,
  createdAt: products.createdAt,
};

const mapProductDetail = (
  row: ProductCatalogRow & {
    createdAt: Date;
  },
  rating: { average: number | null; count: number },
  unitsSold: number,
) => ({
  ...mapProductCatalogItem(row),
  rating: {
    average:
      rating.average === null
        ? null
        : Math.round(Number(rating.average) * 10) / 10,
    count: Number(rating.count ?? 0),
  },
  unitsSold: Number(unitsSold ?? 0),
  createdAt: row.createdAt.toISOString(),
});

export class DrizzleProductRepository implements IProductRepository {
  async list(filters: ProductListFilters): Promise<ProductCatalogPage> {
    const conditions = buildConditions(filters);
    const where = and(...conditions);
    const offset = (filters.page - 1) * filters.pageSize;

    let query = db
      .select(productCatalogSelection)
      .from(products)
      .innerJoin(albums, eq(albums.id, products.albumId))
      .innerJoin(artists, eq(artists.id, albums.artistId))
      .leftJoin(productImages, primaryImageJoinCondition);

    let productSalesSubquery:
      ReturnType<typeof createProductSalesSubquery> | undefined;
    if (filters.sort === "best_selling") {
      productSalesSubquery = createProductSalesSubquery();
      query = query.leftJoin(
        productSalesSubquery,
        eq(productSalesSubquery.productId, products.id),
      );
    }

    const productRows = query
      .where(where)
      .orderBy(...buildOrderBy(filters.sort, productSalesSubquery))
      .limit(filters.pageSize)
      .offset(offset);

    const [rows, countRows] = await Promise.all([
      productRows,
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
      items: rows.map(mapProductCatalogItem),
      pagination: {
        page: filters.page,
        pageSize: filters.pageSize,
        totalItems,
        totalPages,
      },
    };
  }

  async findById(id: string): Promise<ProductDetail | null> {
    const rows = await db
      .select(productDetailSelection)
      .from(products)
      .innerJoin(albums, eq(albums.id, products.albumId))
      .innerJoin(artists, eq(artists.id, albums.artistId))
      .leftJoin(productImages, primaryImageJoinCondition)
      .where(eq(products.id, id))
      .limit(1);

    const row = rows[0];
    if (!row) return null;

    const [images, tags, productCategoryRows, salesRows, ratingRows] =
      await Promise.all([
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
          .innerJoin(
            categories,
            eq(categories.id, productCategories.categoryId),
          )
          .where(eq(productCategories.productId, id))
          .orderBy(asc(categories.name)),
        db
          .select({
            unitsSold: sql<number>`coalesce(sum(${orderItems.quantity}), 0)::integer`,
          })
          .from(orderItems)
          .where(eq(orderItems.productId, id)),
        db
          .select({
            average: sql<
              number | null
            >`avg(${reviews.rating})::double precision`,
            count: sql<number>`count(${reviews.id})::integer`,
          })
          .from(reviews)
          .where(eq(reviews.productId, id)),
      ]);

    const sales = salesRows[0];
    const rating = ratingRows[0];

    return {
      ...mapProductDetail(
        row,
        {
          average: rating?.average ?? null,
          count: rating?.count ?? 0,
        },
        sales?.unitsSold ?? 0,
      ),
      description: row.description,
      images,
      tags: tags.map((row: { tag: string }) => row.tag),
      categories: productCategoryRows,
    };
  }
}
