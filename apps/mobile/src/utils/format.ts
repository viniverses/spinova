/**
 * Formats a monetary value to Brazilian Real (BRL) with space.
 * Example: formatCurrency("80.00") -> "R$ 80,00"
 */
export const formatCurrency = (value: string | number): string => {
  const num = typeof value === "number" ? value : Number(value);
  if (isNaN(num)) return "R$ 0,00";
  return `R$ ${num.toFixed(2).replace(".", ",")}`;
};

/**
 * Formats a postal code (CEP) into XXXXX-XXX format.
 * Example: formatCep("01310100") -> "01310-100"
 */
export const formatCep = (value: string): string => {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  if (digits.length > 5) {
    return `${digits.slice(0, 5)}-${digits.slice(5)}`;
  }
  return digits;
};

/**
 * Formats an ISO date string or Date object into localized pt-BR string.
 * Example: formatDate("2026-09-06T08:00:00Z") -> "06 de set. de 2026"
 */
export const formatDate = (
  value: string | Date,
  options?: Intl.DateTimeFormatOptions,
): string => {
  try {
    const date = typeof value === "string" ? new Date(value) : value;
    if (isNaN(date.getTime())) return String(value);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      ...options,
    });
  } catch {
    return String(value);
  }
};

/**
 * Translates product physical format to Brazilian Portuguese user-friendly label.
 */
export const formatProductFormat = (format: string): string => {
  switch (format) {
    case "vinyl":
      return "Vinil";
    case "cd":
      return "CD";
    case "cassette":
      return "Fita K7";
    default:
      return format;
  }
};
