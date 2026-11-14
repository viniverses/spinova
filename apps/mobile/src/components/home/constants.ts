import { HOME_COLLECTIONS } from "@/constants/collections";

export const HOME_CATEGORIES = [
  ...HOME_COLLECTIONS.map((collection) => ({
    ...collection,
    icon: collection.homeIcon,
    variant: "default" as const,
  })),
  {
    id: "more",
    label: "Mais categorias",
    icon: require("../../../assets/svg/more.png"),
    variant: "primary" as const,
    href: "/lists" as const,
  },
];

export type HomeCategory = (typeof HOME_CATEGORIES)[number];
