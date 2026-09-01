import type { ImageSourcePropType } from "react-native";

/** Colunas 1 e 3 mais estreitas; coluna 2 dominante. A linha é mais larga que a tela para cortar as laterais. */
export const COLUMN_GAP = 12;
export const SIDE_COLUMN_FRAC = 0.39;
export const CENTER_COLUMN_FRAC = 0.56;

/** Frame: 1290×2796. Cartões de coluna: 918.62×1284.12 (largura÷altura para React Native) */
export const COLUMN_ASPECT_RATIO = 918.62 / 1284.12;

export const AUTH_COLUMN_IMAGES: {
  col1: ImageSourcePropType[];
  col2: ImageSourcePropType[];
  col3: ImageSourcePropType[];
} = {
  col1: [
    require("../../../assets/albums/kelela-raven.png"),
    require("../../../assets/albums/yves-tumor-praise-a-lord-who-chews-but-which-does-not-consume-or-simply-hot-between-worlds.png"),
    require("../../../assets/albums/the-xx-i-see-you.png"),
  ],
  col2: [
    require("../../../assets/albums/caroline-polachek-desire-i-want-to-turn-into-you.png"),
    require("../../../assets/albums/kali-uchis-red-moon-in-venus.png"),
    require("../../../assets/albums/sza-sos.png"),
  ],
  col3: [
    require("../../../assets/albums/bjork-fossora.png"),
    require("../../../assets/albums/fka-twigs-lp1.png"),
  ],
};
