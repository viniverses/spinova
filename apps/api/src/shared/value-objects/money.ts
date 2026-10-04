export class Money {
  public readonly currency = "BRL" as const;

  private constructor(public readonly cents: number) {}

  static zero(): Money {
    return new Money(0);
  }

  static fromCents(cents: number): Money {
    if (!Number.isSafeInteger(cents)) {
      throw new RangeError("Money cents must be a safe integer.");
    }
    return new Money(cents);
  }

  static fromDecimal(decimal: string): Money {
    const match = /^(-?)(\d+)(?:\.(\d{1,2}))?$/.exec(decimal);
    if (!match) {
      throw new RangeError("Money must be a decimal string with at most 2 places.");
    }

    const sign = match[1] === "-" ? -1n : 1n;
    const whole = BigInt(match[2] ?? "0");
    const fraction = BigInt((match[3] ?? "").padEnd(2, "0") || "0");
    const cents = sign * (whole * 100n + fraction);
    const amountInCents = Number(cents);

    if (!Number.isSafeInteger(amountInCents)) {
      throw new RangeError("Money amount exceeds the safe integer range.");
    }

    return new Money(amountInCents);
  }

  add(other: Money): Money {
    if (other.currency !== this.currency) {
      throw new RangeError("Cannot add amounts with different currencies.");
    }
    return Money.fromCents(this.cents + other.cents);
  }

  multiply(quantity: number): Money {
    if (!Number.isSafeInteger(quantity) || quantity < 0) {
      throw new RangeError("Money quantity must be a non-negative safe integer.");
    }
    return Money.fromCents(this.cents * quantity);
  }

  get isNegative(): boolean {
    return this.cents < 0;
  }

  toDecimal(): string {
    const absoluteCents = Math.abs(this.cents);
    const whole = Math.floor(absoluteCents / 100);
    const fraction = String(absoluteCents % 100).padStart(2, "0");
    const sign = this.cents < 0 ? "-" : "";
    return `${sign}${whole}.${fraction}`;
  }
}
