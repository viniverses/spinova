import { auth } from "@spinova/auth";

import { createApp } from "./app.ts";
import { createAddressRoutes } from "./modules/address/index.ts";
import { DrizzleAddressOrderLookup } from "./modules/address/infra/readers/drizzle-address-order.lookup.ts";
import { DrizzleAddressRepository } from "./modules/address/infra/repositories/drizzle-address.repository.ts";
import { createCartRoutes } from "./modules/cart/index.ts";
import { DrizzleCartRepository } from "./modules/cart/infra/repositories/drizzle-cart.repository.ts";
import { DrizzleCartReader } from "./modules/cart/infra/readers/drizzle-cart.reader.ts";
import { DrizzleCartCheckoutStore } from "./modules/cart/infra/transaction/drizzle-cart-checkout.store.ts";
import { DrizzleProductStockReader } from "./modules/cart/infra/readers/drizzle-product-stock.reader.ts";
import {
  CheckoutCartUseCase,
  createCheckoutRoutes,
  type CheckoutTransactionContext,
} from "./modules/checkout/index.ts";
import { DrizzleCheckoutTransaction } from "./modules/checkout/infra/transaction/drizzle-checkout-transaction.ts";
import { createOrderRoutes } from "./modules/order/index.ts";
import { DrizzleOrderRepository } from "./modules/order/infra/repositories/drizzle-order.repository.ts";
import { DrizzleOrderWriter } from "./modules/order/infra/transaction/drizzle-order.writer.ts";
import { DrizzleInventoryReservation } from "./modules/inventory/infra/transaction/drizzle-inventory.reservation.ts";
import { DrizzleDeliveryAddressReader } from "./modules/address/infra/readers/drizzle-delivery-address.reader.ts";
import type { DatabaseTransaction } from "./database/transaction.ts";
import { DefaultPricingPolicy } from "./modules/pricing/index.ts";
import { createProductRoutes } from "./modules/catalog/index.ts";
import { DrizzleProductRepository } from "./modules/catalog/infra/repositories/drizzle-product.repository.ts";
import { createWishlistRoutes } from "./modules/wishlist/index.ts";
import { DrizzleWishlistRepository } from "./modules/wishlist/infra/repositories/drizzle-wishlist.repository.ts";

export const createCheckoutContext = (tx: DatabaseTransaction): CheckoutTransactionContext => {
  const cart = new DrizzleCartCheckoutStore(tx);
  const address = new DrizzleDeliveryAddressReader(tx);
  const inventory = new DrizzleInventoryReservation(tx);
  const order = new DrizzleOrderWriter(tx);
  return {
    getCartForUpdate: (userId) => cart.getCartForUpdate(userId),
    clearCart: (cartId) => cart.clearCart(cartId),
    getDeliveryAddress: (userId) => address.getDeliveryAddress(userId),
    reserveStock: (items) => inventory.reserveStock(items),
    recordInventoryMovements: (orderId, items) => inventory.recordInventoryMovements(orderId, items),
    createOrder: (input) => order.createOrder(input),
  };
};

export const createRouteModules = () => {
  const productRepository = new DrizzleProductRepository();
  const wishlistRepository = new DrizzleWishlistRepository();
  const cartRepository = new DrizzleCartRepository();
  const cartReader = new DrizzleCartReader();
  const productStockReader = new DrizzleProductStockReader();
  const orderRepository = new DrizzleOrderRepository();
  const addressRepository = new DrizzleAddressRepository();
  const addressOrderLookup = new DrizzleAddressOrderLookup();
  const pricingCalculator = new DefaultPricingPolicy();
  const checkoutTransaction = new DrizzleCheckoutTransaction(createCheckoutContext);
  const checkoutCart = new CheckoutCartUseCase(
    checkoutTransaction,
    pricingCalculator,
  );

  return {
    productRoutes: createProductRoutes({ productRepository }),
    wishlistRoutes: createWishlistRoutes({ wishlistRepository }),
    cartRoutes: createCartRoutes({
      cartRepository,
      cartReader,
      productStockReader,
      pricingCalculator,
    }),
    orderRoutes: createOrderRoutes({
      orderRepository,
    }),
    checkoutRoutes: createCheckoutRoutes({
      checkoutCart,
    }),
    addressRoutes: createAddressRoutes({
      addressRepository,
      addressOrderLookup,
    }),
  };
};

export const createProductionApp = () =>
  createApp({
    authHandler: auth.handler,
    routeModules: createRouteModules(),
  });
