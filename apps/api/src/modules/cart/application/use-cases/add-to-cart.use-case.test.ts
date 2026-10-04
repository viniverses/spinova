import { describe, expect, it, vi } from "vitest";

import type { CartProduct } from "../../domain/cart-product.ts";
import type { ProductStockReader } from "../ports/product-stock-reader.interface.ts";
import {
  InsufficientStockError,
  ProductNotFoundError,
} from "../../domain/cart.errors.ts";
import { Cart, CartItemEntity } from "../../domain/entities/index.ts";
import type { ICartRepository } from "../../domain/repositories/cart.repository.interface.ts";
import { AddToCartUseCase } from "./add-to-cart.use-case.ts";

const product: CartProduct = { id: "prod-1", price: "150.00" };

const createRepository = (cart: Cart): ICartRepository => ({
  getCartByUserId: vi.fn().mockResolvedValue(cart),
  save: vi.fn().mockResolvedValue(undefined),
});

describe("AddToCartUseCase", () => {
  it("adds an item through the cart aggregate and saves it", async () => {
    const cart = Cart.empty();
    const cartRepository = createRepository(cart);
    const productStockReader: ProductStockReader = {
      getProductStock: vi.fn().mockResolvedValue({
        product,
        stockQuantity: 10,
      }),
    };

    const useCase = new AddToCartUseCase(cartRepository, productStockReader);
    const result = await useCase.execute({
      userId: "user-123",
      productId: "prod-1",
    });

    expect(cart.items).toHaveLength(1);
    expect(cart.items[0]?.quantity).toBe(1);
    expect(cartRepository.save).toHaveBeenCalledWith(
      "user-123",
      cart,
      expect.objectContaining({ id: null, items: [] }),
    );
    expect(result).toBeUndefined();
  });

  it("throws ProductNotFoundError when the product does not exist", async () => {
    const cartRepository = createRepository(Cart.empty());
    const productStockReader: ProductStockReader = {
      getProductStock: vi.fn().mockResolvedValue(null),
    };

    const useCase = new AddToCartUseCase(cartRepository, productStockReader);

    await expect(
      useCase.execute({ userId: "user-123", productId: "prod-999" }),
    ).rejects.toThrow(ProductNotFoundError);
  });

  it("throws InsufficientStockError when the product is out of stock", async () => {
    const cartRepository = createRepository(Cart.empty());
    const productStockReader: ProductStockReader = {
      getProductStock: vi.fn().mockResolvedValue({
        product,
        stockQuantity: 0,
      }),
    };

    const useCase = new AddToCartUseCase(cartRepository, productStockReader);

    await expect(
      useCase.execute({ userId: "user-123", productId: "prod-1" }),
    ).rejects.toThrow(InsufficientStockError);
  });

  it("throws when the aggregate cannot increase an item past its limit", async () => {
    const cart = new Cart("cart-1", [new CartItemEntity("item-1", 99, product)]);
    const cartRepository = createRepository(cart);
    const productStockReader: ProductStockReader = {
      getProductStock: vi.fn().mockResolvedValue({
        product,
        stockQuantity: 99,
      }),
    };

    const useCase = new AddToCartUseCase(cartRepository, productStockReader);

    await expect(
      useCase.execute({ userId: "user-123", productId: "prod-1" }),
    ).rejects.toThrow(InsufficientStockError);
    expect(cartRepository.save).not.toHaveBeenCalled();
  });
});
