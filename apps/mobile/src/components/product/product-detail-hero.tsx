import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRef, useState } from "react";
import { Pressable, View } from "react-native";
import Carousel, {
  type ICarouselInstance,
} from "react-native-reanimated-carousel";

import type { ProductImage } from "@/services/products";

type ProductDetailHeroProps = {
  images: ProductImage[];
  title: string;
  width: number;
};

export const ProductDetailHero = ({
  images,
  title,
  width,
}: ProductDetailHeroProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef<ICarouselInstance>(null);
  const slides = images.length > 0 ? images : [null];
  const height = width * 0.885;

  const handleProgressChange = (
    _offsetProgress: number,
    absoluteProgress: number,
  ) => {
    const nextIndex = Math.min(
      slides.length - 1,
      Math.max(0, Math.round(absoluteProgress)),
    );

    setActiveIndex((currentIndex) =>
      currentIndex === nextIndex ? currentIndex : nextIndex,
    );
  };

  return (
    <View
      className="overflow-hidden rounded-xl bg-[#D0D0D0]"
      style={{ width, height }}
    >
      <Carousel
        ref={carouselRef}
        width={width}
        height={height}
        data={slides}
        loop={false}
        pagingEnabled
        snapEnabled
        enabled={slides.length > 1}
        onProgressChange={handleProgressChange}
        renderItem={({ item: image }) => (
          <View
            className="overflow-hidden bg-[#C9C9C9]"
            style={{ width, height }}
          >
            <View
              className="absolute rounded-full bg-[#060606]"
              style={{
                width: width * 0.71,
                height: width * 0.71,
                right: width * 0.05,
                top: width * 0.075,
                borderWidth: 1,
                borderColor: "#202020",
              }}
            >
              <View className="m-auto h-1/2 w-1/2 rounded-full border border-[#262626]" />
              <View className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1.5 -translate-y-1.5 rounded-full bg-[#BBBBBB]" />
            </View>

            <View
              className="absolute overflow-hidden bg-[#29262B]"
              style={{
                width: width * 0.71,
                height: width * 0.71,
                left: width * 0.09,
                top: width * 0.075,
                elevation: 8,
                shadowColor: "#000000",
                shadowOffset: { width: 4, height: 8 },
                shadowOpacity: 0.42,
                shadowRadius: 8,
              }}
            >
              {image ? (
                <Image
                  source={image.url}
                  accessibilityLabel={image.altText ?? title}
                  contentFit="cover"
                  style={{ width: "100%", height: "100%" }}
                  transition={180}
                />
              ) : (
                <View className="flex-1 items-center justify-center">
                  <Ionicons name="disc-outline" size={64} color="#777179" />
                </View>
              )}
            </View>

            <LinearGradient
              colors={["transparent", "rgba(17,15,18,0.62)"]}
              locations={[0.55, 1]}
              className="absolute inset-0"
              pointerEvents="none"
            />
          </View>
        )}
      />

      <View
        className="absolute bottom-0 left-0 right-0 flex-row justify-center"
        style={{ gap: 5 }}
      >
        {slides.map((_, index) => (
          <Pressable
            key={index}
            onPress={() => {
              carouselRef.current?.scrollTo({ index, animated: true });
              setActiveIndex(index);
            }}
            accessibilityRole="button"
            accessibilityLabel={`Exibir imagem ${index + 1} de ${slides.length}`}
            accessibilityState={{ selected: activeIndex === index }}
            className={`h-10 items-center justify-center active:opacity-70 ${
              activeIndex === index ? "w-5" : "w-2"
            }`}
            hitSlop={{ top: 4, bottom: 4, left: 7, right: 7 }}
          >
            <View
              className={`h-2 rounded-full ${
                activeIndex === index ? "w-5 bg-white" : "w-2 bg-[#8E8E93]"
              }`}
            />
          </Pressable>
        ))}
      </View>
    </View>
  );
};
