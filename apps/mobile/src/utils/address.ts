import type { Address } from "@/services/addresses";

export function formatAddressLines(
  address: Pick<
    Address,
    "street" | "number" | "complement" | "neighborhood" | "city" | "state"
  >,
): string[] {
  return [
    `${address.street}, ${address.number}${address.complement ? ` - ${address.complement}` : ""}`,
    address.neighborhood
      ? `${address.neighborhood}, ${address.city} - ${address.state}`
      : `${address.city} - ${address.state}`,
  ];
}
