import { View, useWindowDimensions } from "react-native";
import { AnimatedColumn } from "../animated-column";
import {
  COLUMN_ASPECT_RATIO,
  COLUMN_GAP,
  CENTER_COLUMN_FRAC,
  AUTH_COLUMN_IMAGES,
  SIDE_COLUMN_FRAC,
} from "./auth-constants";

export const AuthBackground = () => {
  const { width: windowWidth } = useWindowDimensions();

  const sideColumnWidth = windowWidth * SIDE_COLUMN_FRAC;
  const centerColumnWidth = windowWidth * CENTER_COLUMN_FRAC;
  const columnsRowWidth =
    sideColumnWidth +
    COLUMN_GAP +
    centerColumnWidth +
    COLUMN_GAP +
    sideColumnWidth;
  const columnsRowOffsetX = (windowWidth - columnsRowWidth) / 2;

  return (
    <View
      className="absolute inset-0 overflow-hidden"
      style={{ width: windowWidth }}
    >
      <View
        className="h-full flex-row"
        style={{
          width: columnsRowWidth,
          marginLeft: columnsRowOffsetX,
          gap: COLUMN_GAP,
        }}
      >
        <View style={{ width: sideColumnWidth }}>
          <AnimatedColumn
            images={AUTH_COLUMN_IMAGES.col1}
            duration={65000}
            imageAspectRatio={COLUMN_ASPECT_RATIO}
          />
        </View>

        <View style={{ width: centerColumnWidth, marginTop: 48 }}>
          <AnimatedColumn
            images={AUTH_COLUMN_IMAGES.col2}
            duration={110000}
            imageAspectRatio={COLUMN_ASPECT_RATIO}
          />
        </View>

        <View style={{ width: sideColumnWidth }}>
          <AnimatedColumn
            images={AUTH_COLUMN_IMAGES.col3}
            duration={85000}
            imageAspectRatio={COLUMN_ASPECT_RATIO}
          />
        </View>
      </View>
    </View>
  );
};
