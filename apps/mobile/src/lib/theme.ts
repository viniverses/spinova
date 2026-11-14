export const colors = {
  primary: {
    DEFAULT: "#E14842",
    foreground: "#211719",
    soft: "#E14842",
  },
  surface: {
    DEFAULT: "#151315",
    base: "#171518",
    elevated: "#272628",
    control: "#2C2C2E",
  },
  muted: {
    DEFAULT: "#777179",
    foreground: "#777179",
  },
  error: "#FF9B96",
} as const;

export function withAlpha(hex: string, alpha: number): string {
  const normalized = hex.replace("#", "");
  const r = Number.parseInt(normalized.slice(0, 2), 16);
  const g = Number.parseInt(normalized.slice(2, 4), 16);
  const b = Number.parseInt(normalized.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

