import type { ImageSourcePropType } from "react-native";

export type HomeBanner = {
  id: string;
  title: string;
  subtitle: string;
  image: ImageSourcePropType;
};

export const HOME_BANNERS: HomeBanner[] = [
  {
    id: "1",
    title: "Caroline Polachek",
    subtitle: "Destaque da semana",
    image: require("../assets/banners/1.png"),
  },
  {
    id: "2",
    title: "Melanie Martinez - Portals",
    subtitle: "Pré-venda",
    image: require("../assets/banners/2.png"),
  },
  {
    id: "3",
    title: "Taylor Swift - Midnights",
    subtitle: "Lançamento",
    image: require("../assets/banners/3.png"),
  },
];
