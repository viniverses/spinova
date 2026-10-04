import {
  CartItemEntity,
  MAX_CART_ITEM_QUANTITY,
} from "./cart-item.entity.ts";
import {
  CartItemNotFoundError,
  InvalidCartError,
  InvalidCartQuantityError,
} from "../cart.errors.ts";
import type { CartProduct } from "../cart-product.ts";
import { InsufficientStockError } from "../cart.errors.ts";
import { Money } from "../../../../shared/value-objects/money.ts";

export class Cart {
  private readonly _items: CartItemEntity[];

  constructor(
    public readonly id: string | null,
    items: readonly CartItemEntity[],
  ) {
    const productIds = new Set<string>();
    for (const item of items) {
      if (productIds.has(item.product.id)) {
        throw new InvalidCartError(
          "A cart cannot contain the same product more than once.",
          { productId: item.product.id },
        );
      }
      productIds.add(item.product.id);
    }

    this._items = [...items];
  }

  static empty(): Cart {
    return new Cart(null, []);
  }

  public get items(): readonly CartItemEntity[] {
    return [...this._items];
  }

  public clone(): Cart {
    return new Cart(
      this.id,
      this._items.map(
        (item) => new CartItemEntity(item.id, item.quantity, item.product),
      ),
    );
  }

  public addItem(product: CartProduct, availableStock: number): void {
    if (!Number.isInteger(availableStock) || availableStock < 1) {
      throw new InsufficientStockError(product.id);
    }

    const maximumQuantity = Math.min(
      availableStock,
      MAX_CART_ITEM_QUANTITY,
    );
    const index = this._items.findIndex(
      (item) => item.product.id === product.id,
    );

    if (index === -1) {
      this._items.push(new CartItemEntity(undefined, 1, product));
      return;
    }

    const item = this._items[index];
    if (!item) return;
    if (item.quantity >= maximumQuantity) {
      throw new InsufficientStockError(product.id);
    }
    this._items[index] = item.withQuantity(item.quantity + 1, maximumQuantity);
  }

  public changeQuantity(
    productId: string,
    quantity: number,
    availableStock: number,
  ): void {
    if (!Number.isInteger(quantity) || quantity < 0) {
      throw new InvalidCartQuantityError(quantity);
    }

    if (quantity === 0) {
      this.removeItem(productId);
      return;
    }

    const index = this._items.findIndex(
      (item) => item.product.id === productId,
    );
    if (index === -1) {
      throw new CartItemNotFoundError(productId);
    }

    if (!Number.isInteger(availableStock) || quantity > availableStock) {
      throw new InsufficientStockError(productId);
    }

    const item = this._items[index];
    if (!item) return;
    this._items[index] = item.withQuantity(
      quantity,
      Math.min(availableStock, MAX_CART_ITEM_QUANTITY),
    );
  }

  public removeItem(productId: string): void {
    const index = this._items.findIndex(
      (item) => item.product.id === productId,
    );
    if (index === -1) {
      throw new CartItemNotFoundError(productId);
    }

    this._items.splice(index, 1);
  }

  get totalQuantity(): number {
    return this._items.reduce((sum, item) => sum + item.quantity, 0);
  }

  get subtotalMoney(): Money {
    return this._items.reduce(
      (subtotal, item) => subtotal.add(item.subtotal),
      Money.zero(),
    );
  }

  get subtotalInCents(): number {
    return this.subtotalMoney.cents;
  }

  get subtotal(): string {
    return this.subtotalMoney.toDecimal();
  }
}

export { Cart as CartEntity };
