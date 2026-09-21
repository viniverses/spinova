import { relations } from "drizzle-orm";

import { addresses } from "./address/addresses.ts";
import { albums } from "./catalog/albums.ts";
import { artists } from "./catalog/artists.ts";
import { cartItems } from "./cart/cart-items.ts";
import { carts } from "./cart/carts.ts";
import { categories } from "./catalog/categories.ts";
import { coupons } from "./promotion/coupons.ts";
import { featuredItems } from "./featured/featured-items.ts";
import { featuredSections } from "./featured/featured-sections.ts";
import { inventoryMovements } from "./inventory/inventory-movements.ts";
import { orderCoupons } from "./order/order-coupons.ts";
import { orderItems } from "./order/order-items.ts";
import { orders } from "./order/orders.ts";
import { payments } from "./payment/payments.ts";
import { productCategories } from "./catalog/product-categories.ts";
import { productImages } from "./catalog/product-images.ts";
import { productTags } from "./catalog/product-tags.ts";
import { products } from "./catalog/products.ts";
import { reviews } from "./catalog/reviews.ts";
import { stockNotifications } from "./inventory/stock-notifications.ts";
import { user } from "./auth/user.ts";
import { wishlists } from "./wishlist/wishlists.ts";

export const artistRelations = relations(artists, ({ many }) => ({
  albums: many(albums),
}));

export const albumRelations = relations(albums, ({ many, one }) => ({
  artist: one(artists, {
    fields: [albums.artistId],
    references: [artists.id],
  }),
  products: many(products),
}));

export const productRelations = relations(products, ({ many, one }) => ({
  album: one(albums, {
    fields: [products.albumId],
    references: [albums.id],
  }),
  categories: many(productCategories),
  wishlistEntries: many(wishlists),
  cartItems: many(cartItems),
  orderItems: many(orderItems),
  featuredItems: many(featuredItems),
  reviews: many(reviews),
  inventoryMovements: many(inventoryMovements),
  stockNotifications: many(stockNotifications),
  images: many(productImages),
  tags: many(productTags),
}));

export const categoryRelations = relations(categories, ({ many }) => ({
  products: many(productCategories),
}));

export const productCategoryRelations = relations(
  productCategories,
  ({ one }) => ({
    product: one(products, {
      fields: [productCategories.productId],
      references: [products.id],
    }),
    category: one(categories, {
      fields: [productCategories.categoryId],
      references: [categories.id],
    }),
  }),
);

export const wishlistRelations = relations(wishlists, ({ one }) => ({
  user: one(user, {
    fields: [wishlists.userId],
    references: [user.id],
  }),
  product: one(products, {
    fields: [wishlists.productId],
    references: [products.id],
  }),
}));

export const cartRelations = relations(carts, ({ many, one }) => ({
  user: one(user, {
    fields: [carts.userId],
    references: [user.id],
  }),
  items: many(cartItems),
}));

export const cartItemRelations = relations(cartItems, ({ one }) => ({
  cart: one(carts, {
    fields: [cartItems.cartId],
    references: [carts.id],
  }),
  product: one(products, {
    fields: [cartItems.productId],
    references: [products.id],
  }),
}));

export const orderRelations = relations(orders, ({ many, one }) => ({
  user: one(user, {
    fields: [orders.userId],
    references: [user.id],
  }),
  items: many(orderItems),
  address: one(addresses, {
    fields: [orders.addressId],
    references: [addresses.id],
  }),
  payments: many(payments),
  coupons: many(orderCoupons),
}));

export const orderItemRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));

export const featuredSectionRelations = relations(
  featuredSections,
  ({ many }) => ({
    items: many(featuredItems),
  }),
);

export const featuredItemRelations = relations(featuredItems, ({ one }) => ({
  section: one(featuredSections, {
    fields: [featuredItems.sectionId],
    references: [featuredSections.id],
  }),
  product: one(products, {
    fields: [featuredItems.productId],
    references: [products.id],
  }),
}));

export const reviewRelations = relations(reviews, ({ one }) => ({
  product: one(products, {
    fields: [reviews.productId],
    references: [products.id],
  }),
  user: one(user, {
    fields: [reviews.userId],
    references: [user.id],
  }),
}));

export const couponRelations = relations(coupons, ({ many }) => ({
  orders: many(orderCoupons),
}));

export const orderCouponRelations = relations(orderCoupons, ({ one }) => ({
  order: one(orders, {
    fields: [orderCoupons.orderId],
    references: [orders.id],
  }),
  coupon: one(coupons, {
    fields: [orderCoupons.couponId],
    references: [coupons.id],
  }),
}));

export const addressRelations = relations(addresses, ({ many, one }) => ({
  user: one(user, {
    fields: [addresses.userId],
    references: [user.id],
  }),
  orders: many(orders),
}));

export const paymentRelations = relations(payments, ({ one }) => ({
  order: one(orders, {
    fields: [payments.orderId],
    references: [orders.id],
  }),
}));

export const inventoryMovementRelations = relations(
  inventoryMovements,
  ({ one }) => ({
    product: one(products, {
      fields: [inventoryMovements.productId],
      references: [products.id],
    }),
  }),
);

export const stockNotificationRelations = relations(
  stockNotifications,
  ({ one }) => ({
    user: one(user, {
      fields: [stockNotifications.userId],
      references: [user.id],
    }),
    product: one(products, {
      fields: [stockNotifications.productId],
      references: [products.id],
    }),
  }),
);

export const productImageRelations = relations(productImages, ({ one }) => ({
  product: one(products, {
    fields: [productImages.productId],
    references: [products.id],
  }),
}));

export const productTagRelations = relations(productTags, ({ one }) => ({
  product: one(products, {
    fields: [productTags.productId],
    references: [products.id],
  }),
}));
