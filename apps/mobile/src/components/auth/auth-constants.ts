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
    require("../../../assets/albums/4.png"),
    require("../../../assets/albums/2.png"),
    require("../../../assets/albums/6.png"),
  ],
  col2: [
    require("../../../assets/albums/1.png"),
    require("../../../assets/albums/3.png"),
    require("../../../assets/albums/5.png"),
  ],
  col3: [
    require("../../../assets/albums/7.png"),
    require("../../../assets/albums/8.png"),
    require("../../../assets/albums/9.png"),
  ],
};
