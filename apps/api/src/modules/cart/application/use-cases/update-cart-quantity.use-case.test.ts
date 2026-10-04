import { describe, expect, it, vi } from "vitest";

import type { CartProduct } from "../../domain/cart-product.ts";
import type { ProductStockReader } from "../ports/product-stock-reader.interface.ts";
import {
  CartItemNotFoundError,
  InsufficientStockError,
} from "../../domain/cart.errors.ts";
import { Cart, CartItemEntity } from "../../domain/entities/index.ts";
import type { ICartRepository } from "../../domain/repositories/cart.repository.interface.ts";
import { UpdateCartQuantityUseCase } from "./update-cart-quantity.use-case.ts";

const product: CartProduct = { id: "prod-1", price: "150.00" };

const createRepository = (cart: Cart): ICartRepository => ({
  getCartByUserId: vi.fn().mockResolvedValue(cart),
  save: vi.fn().mockResolvedValue(undefined),
});

const createCart = (quantity = 1) =>
  new Cart("cart-1", [new CartItemEntity("item-1", quantity, product)]);

describe("UpdateCartQuantityUseCase", () => {
  it("removes an item through the aggregate when quantity is zero", async () => {
    const cart = createCart();
    const cartRepository = createRepository(cart);
    const productStockReader: ProductStockReader = {
      getProductStock: vi.fn(),
    };

    const useCase = new UpdateCartQuantityUseCase(
      cartRepository,
      productStockReader,
    );
    const result = await useCase.execute({
      userId: "user-123",
      productId: "prod-1",
      quantity: 0,
    });

    expect(cart.items).toHaveLength(0);
    expect(cartRepository.save).toHaveBeenCalledWith(
      "user-123",
      cart,
      expect.objectContaining({ id: "cart-1", items: expect.any(Array) }),
    );
    expect(productStockReader.getProductStock).not.toHaveBeenCalled();
    expect(result).toBeUndefined();
  });

  it("throws when removing an item that is not in the cart", async () => {
    const cartRepository = createRepository(Cart.empty());
    const useCase = new UpdateCartQuantityUseCase(cartRepository, {
      getProductStock: vi.fn(),
    });

    await expect(
      useCase.execute({ userId: "user-123", productId: "prod-1", quantity: 0 }),
    ).rejects.toThrow(CartItemNotFoundError);
  });

  it("changes quantity through the aggregate and saves it", async () => {
    const cart = createCart();
    const cartRepository = createRepository(cart);
    const productStockReader: ProductStockReader = {
      getProductStock: vi.fn().mockResolvedValue({
        product,
        stockQuantity: 10,
      }),
    };

    const useCase = new UpdateCartQuantityUseCase(
      cartRepository,
      productStockReader,
    );
    const result = await useCase.execute({
      userId: "user-123",
      productId: "prod-1",
      quantity: 3,
    });

    expect(cart.items[0]?.quantity).toBe(3);
    expect(cartRepository.save).toHaveBeenCalledWith(
      "user-123",
      cart,
      expect.objectContaining({ id: "cart-1", items: expect.any(Array) }),
    );
    expect(result).toBeUndefined();
  });

  it("throws CartItemNotFoundError when the product snapshot is missing", async () => {
    const cartRepository = createRepository(createCart());
    const useCase = new UpdateCartQuantityUseCase(cartRepository, {
      getProductStock: vi.fn().mockResolvedValue(null),
    });

    await expect(
      useCase.execute({ userId: "user-123", productId: "prod-1", quantity: 2 }),
    ).rejects.toThrow(CartItemNotFoundError);
  });

  it("throws InsufficientStockError when quantity exceeds stock", async () => {
    const cartRepository = createRepository(createCart());
    const useCase = new UpdateCartQuantityUseCase(cartRepository, {
      getProductStock: vi.fn().mockResolvedValue({
        product,
        stockQuantity: 2,
      }),
    });

    await expect(
      useCase.execute({ userId: "user-123", productId: "prod-1", quantity: 5 }),
    ).rejects.toThrow(InsufficientStockError);
  });

  it("throws CartItemNotFoundError when changing a missing item", async () => {
    const cartRepository = createRepository(Cart.empty());
    const useCase = new UpdateCartQuantityUseCase(cartRepository, {
      getProductStock: vi.fn().mockResolvedValue({
        product,
        stockQuantity: 10,
      }),
    });

    await expect(
      useCase.execute({ userId: "user-123", productId: "prod-1", quantity: 2 }),
    ).rejects.toThrow(CartItemNotFoundError);
  });
});
