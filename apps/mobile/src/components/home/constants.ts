export type HomeCategory = {
  id: string;
  label: string;
  icon: string;
  variant: "default" | "primary";
};

export const HOME_CATEGORIES: HomeCategory[] = [
  {
    id: "bestsellers",
    label: "Mais vendidos",
    icon: "flame",
    variant: "default",
  },
  { id: "new", label: "Novos", icon: "sparkles", variant: "default" },
  { id: "promo", label: "Promoções", icon: "pricetag", variant: "default" },
  {
    id: "import",
    label: "Importados",
    icon: "globe-outline",
    variant: "default",
  },
  {
    id: "national",
    label: "Nacionais",
    icon: "map-outline",
    variant: "default",
  },
  {
    id: "more",
    label: "Mais categorias",
    icon: "ellipsis-horizontal",
    variant: "primary",
  },
];
