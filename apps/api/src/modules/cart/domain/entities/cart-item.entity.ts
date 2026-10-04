import type { CartProduct } from "../cart-product.ts";
import { Money } from "../../../../shared/value-objects/money.ts";
import { InvalidCartQuantityError } from "../cart.errors.ts";

export const MAX_CART_ITEM_QUANTITY = 99;

export class CartItemEntity {
  public readonly id: string | undefined;
  public readonly product: CartProduct;
  public readonly unitPrice: Money;
  private readonly _quantity: number;

  constructor(
    id: string | undefined,
    quantity: number,
    product: CartProduct,
  ) {
    this.assertQuantity(quantity);
    this.id = id;
    this._quantity = quantity;
    this.product = Object.freeze({ id: product.id, price: product.price });
    this.unitPrice = Money.fromDecimal(product.price);
  }

  public get quantity(): number {
    return this._quantity;
  }

  public withQuantity(
    quantity: number,
    maximumQuantity = MAX_CART_ITEM_QUANTITY,
  ): CartItemEntity {
    this.assertQuantity(quantity);
    if (quantity > maximumQuantity) {
      throw new InvalidCartQuantityError(quantity);
    }

    return new CartItemEntity(this.id, quantity, this.product);
  }

  get subtotal(): Money {
    return this.unitPrice.multiply(this.quantity);
  }

  get subtotalInCents(): number {
    return this.subtotal.cents;
  }

  private assertQuantity(quantity: number): void {
    if (
      !Number.isInteger(quantity) ||
      quantity < 1 ||
      quantity > MAX_CART_ITEM_QUANTITY
    ) {
      throw new InvalidCartQuantityError(quantity);
    }
  }
}
