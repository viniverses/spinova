import { RepositoryError } from "../../errors/index.ts";
import {
  albums,
  artists,
  cartItems,
  carts,
  db,
  productImages,
  products,
} from "@spinova/database";
import { and, asc, eq, sql } from "@spinova/database/query";

const cartItemSelection = {
  id: cartItems.id,
  quantity: cartItems.quantity,
  productId: products.id,
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
  imageUrl: productImages.url,
  imageAltText: productImages.altText,
};

type CartItemRow = Awaited<ReturnType<typeof selectCartItems>>[number];

const selectCartItems = (cartId: string) =>
  db
    .select(cartItemSelection)
    .from(cartItems)
    .innerJoin(products, eq(products.id, cartItems.productId))
    .innerJoin(albums, eq(albums.id, products.albumId))
    .innerJoin(artists, eq(artists.id, albums.artistId))
    .leftJoin(
      productImages,
      and(
        eq(productImages.productId, products.id),
        eq(productImages.position, 0),
      ),
    )
    .where(eq(cartItems.cartId, cartId))
    .orderBy(asc(cartItems.id));

const mapCartItem = (row: CartItemRow) => ({
  id: row.id,
  quantity: row.quantity,
  product: {
    id: row.productId,
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
  },
});

const summarizeCart = (id: string | null, rows: CartItemRow[]) => {
  const subtotalInCents = rows.reduce(
    (sum, row) => sum + Math.round(Number(row.price) * 100) * row.quantity,
    0,
  );

  return {
    id,
    items: rows.map(mapCartItem),
    subtotal: (subtotalInCents / 100).toFixed(2),
    totalQuantity: rows.reduce((sum, row) => sum + row.quantity, 0),
    currency: "BRL" as const,
  };
};

export const getCartByUserId = async (userId: string) => {
  try {
    const [cart] = await db
      .select({ id: carts.id })
      .from(carts)
      .where(eq(carts.userId, userId))
      .limit(1);

    if (!cart) return summarizeCart(null, []);

    return summarizeCart(cart.id, await selectCartItems(cart.id));
  } catch (error) {
    throw new RepositoryError("list", "cart", error);
  }
};

const getOrCreateCartId = async (userId: string) => {
  const [cart] = await db
    .insert(carts)
    .values({ userId })
    .onConflictDoUpdate({
      target: carts.userId,
      set: { userId },
    })
    .returning({ id: carts.id });

  if (!cart) throw new Error("Cart could not be created.");
  return cart.id;
};

const getProductStock = async (productId: string) => {
  const [product] = await db
    .select({ stockQuantity: products.stockQuantity })
    .from(products)
    .where(eq(products.id, productId))
    .limit(1);
  return product?.stockQuantity ?? null;
};

export const addCartItem = async (userId: string, productId: string) => {
  try {
    const stockQuantity = await getProductStock(productId);
    if (stockQuantity === null) return { status: "product-not-found" } as const;
    if (stockQuantity < 1) return { status: "out-of-stock" } as const;
    const maximumQuantity = Math.min(stockQuantity, 99);

    const cartId = await getOrCreateCartId(userId);
    const [saved] = await db
      .insert(cartItems)
      .values({ cartId, productId, quantity: 1 })
      .onConflictDoUpdate({
        target: [cartItems.cartId, cartItems.productId],
        set: {
          quantity: sql`${cartItems.quantity} + 1`,
        },
        setWhere: sql`${cartItems.quantity} < ${maximumQuantity}`,
      })
      .returning({ id: cartItems.id });

    if (!saved) return { status: "out-of-stock" } as const;

    const row = (await selectCartItems(cartId)).find(
      (item) => item.productId === productId,
    );
    if (!row) throw new Error("Cart item was not returned after insert.");

    return { status: "ok", item: mapCartItem(row) } as const;
  } catch (error) {
    throw new RepositoryError("insert", "cart item", error);
  }
};

export const setCartItemQuantity = async (
  userId: string,
  productId: string,
  quantity: number,
) => {
  try {
    const [cart] = await db
      .select({ id: carts.id })
      .from(carts)
      .where(eq(carts.userId, userId))
      .limit(1);
    if (!cart) return { status: "item-not-found" } as const;

    if (quantity === 0) {
      const [deleted] = await db
        .delete(cartItems)
        .where(
          and(
            eq(cartItems.cartId, cart.id),
            eq(cartItems.productId, productId),
          ),
        )
        .returning({ id: cartItems.id });
      return deleted
        ? ({ status: "removed" } as const)
        : ({ status: "item-not-found" } as const);
    }

    const stockQuantity = await getProductStock(productId);
    if (stockQuantity === null) return { status: "product-not-found" } as const;
    if (quantity > stockQuantity) return { status: "out-of-stock" } as const;

    const [updated] = await db
      .update(cartItems)
      .set({ quantity })
      .where(
        and(eq(cartItems.cartId, cart.id), eq(cartItems.productId, productId)),
      )
      .returning({ id: cartItems.id });
    if (!updated) return { status: "item-not-found" } as const;

    const row = (await selectCartItems(cart.id)).find(
      (item) => item.productId === productId,
    );
    if (!row) throw new Error("Cart item was not returned after update.");

    return { status: "ok", item: mapCartItem(row) } as const;
  } catch (error) {
    throw new RepositoryError("update", "cart item", error);
  }
};
