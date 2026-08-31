import React, { useCallback, useState } from "react";
import {
  type ImageSourcePropType,
  type LayoutChangeEvent,
  Platform,
  View,
} from "react-native";
import { Image } from "expo-image";
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

const IMAGE_GAP = 12;
const IMAGE_BORDER_RADIUS = 16;

/**
 * Frame Figma: 1290 × 2796. Cartão por coluna: 918.62 × 1284.12 → largura ÷ altura.
 * A altura do cartão acompanha a largura da coluna no layout.
 */
const DEFAULT_IMAGE_ASPECT_RATIO = 918.62 / 1284.12;

/** Drop shadow (Figma): X 3, Y 7, blur 10, spread 0, #000 @ 10% */
const imageShadowStyle = {
  shadowColor: "#000000",
  shadowOffset: { width: 3, height: 7 },
  shadowOpacity: 0.1,
  shadowRadius: 10,
  ...Platform.select({
    android: { elevation: 6 },
    default: {},
  }),
};

type AnimatedColumnProps = {
  images: ImageSourcePropType[];
  duration?: number;
  /** Proporção do quadro (largura/altura). A imagem preenche o quadro com `contentFit="cover"`. */
  imageAspectRatio?: number;
};

export const AnimatedColumn = ({
  images,
  duration = 20000,
  imageAspectRatio = DEFAULT_IMAGE_ASPECT_RATIO,
}: AnimatedColumnProps) => {
  const translateY = useSharedValue(0);
  const reduceMotion = useReducedMotion();
  const [ready, setReady] = useState(false);

  const handleLayout = useCallback(
    (e: LayoutChangeEvent) => {
      const totalHeight = e.nativeEvent.layout.height;
      const halfHeight = totalHeight / 2;

      translateY.value = 0;
      if (!reduceMotion) {
        translateY.value = withRepeat(
          withTiming(-halfHeight, {
            duration,
            easing: Easing.linear,
          }),
          -1,
          false,
        );
      }

      if (!ready) setReady(true);
    },
    [duration, ready, reduceMotion, translateY],
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const loopedImages = [...images, ...images];

  return (
    <Animated.View
      style={[animatedStyle, { opacity: ready ? 1 : 0 }]}
      onLayout={handleLayout}
    >
      {loopedImages.map((img, index) => (
        <View
          key={index}
          style={[
            {
              width: "100%",
              marginBottom: IMAGE_GAP,
              borderRadius: IMAGE_BORDER_RADIUS,
            },
            imageShadowStyle,
          ]}
        >
          <View
            style={{
              width: "100%",
              aspectRatio: imageAspectRatio,
              borderRadius: IMAGE_BORDER_RADIUS,
              overflow: "hidden",
            }}
          >
            <Image
              source={img}
              contentFit="cover"
              style={{
                width: "100%",
                height: "100%",
                borderRadius: IMAGE_BORDER_RADIUS,
              }}
            />
          </View>
        </View>
      ))}
    </Animated.View>
  );
};
