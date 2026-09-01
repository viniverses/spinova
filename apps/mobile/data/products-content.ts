import type { ImageSourcePropType } from "react-native";

export type Product = {
  id: string;
  title: string;
  artist: string;
  priceLabel: string;
  price: number;
  cover: ImageSourcePropType;
};

export const PRODUCTS: Product[] = [
  {
    id: "w1",
    title: "Carrie & Lowell",
    artist: "Sufjan Stevens",
    priceLabel: "R$105,90",
    price: 105.9,
    cover: require("../assets/albums/sza-sos.png"),
  },
  {
    id: "w2",
    title: "The Avalanch...",
    artist: "Sufjan Stevens",
    priceLabel: "R$105,90",
    price: 105.9,
    cover: require("../assets/albums/the-xx-i-see-you.png"),
  },
  {
    id: "w3",
    title: "India",
    artist: "Gala Costa",
    priceLabel: "R$89,90",
    price: 89.9,
    cover: require("../assets/albums/bjork-fossora.png"),
  },
  {
    id: "w5",
    title: "Vício Inere...",
    artist: "Marina Sena",
    priceLabel: "R$115,90",
    price: 115.9,
    cover: require("../assets/albums/caroline-polachek-desire-i-want-to-turn-into-you.png"),
  },
  {
    id: "w6",
    title: "The Age of Adz",
    artist: "Sufjan Stevens",
    priceLabel: "R$105,90",
    price: 105.9,
    cover: require("../assets/albums/yves-tumor-praise-a-lord-who-chews-but-which-does-not-consume-or-simply-hot-between-worlds.png"),
  },
];

export const getProductById = (id: string) => {
  return PRODUCTS.find((p) => p.id === id) ?? null;
};
