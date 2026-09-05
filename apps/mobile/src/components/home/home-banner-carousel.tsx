import { LinearGradient } from "expo-linear-gradient";
import {
  Image,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { HOME_BANNERS } from "../../../data/home-banners";

const BANNER_HEIGHT = 196;
const BANNER_RADIUS = 10;

export const HomeBannerCarousel = () => {
  const { width } = useWindowDimensions();

  /** Offset maior = mais área dos banners laterais visível */
  const parallaxScrollingOffset = Math.round(width * 0.42);

  return (
    <View className="pb-2">
      <Carousel
        loop
        width={width}
        height={BANNER_HEIGHT}
        data={HOME_BANNERS}
        autoPlay
        autoPlayInterval={5500}
        scrollAnimationDuration={650}
        mode="parallax"
        modeConfig={{
          parallaxScrollingScale: 1,
          parallaxScrollingOffset,
          parallaxAdjacentItemScale: 0.92,
        }}
        renderItem={({ item }) => {
          const cardWidth = width - 24;
          const cardHeight = BANNER_HEIGHT - 8;

          return (
            <View
              style={{ width, height: BANNER_HEIGHT }}
              className="justify-center px-3"
            >
              <View
                style={{
                  height: cardHeight,
                  width: cardWidth,
                  alignSelf: "center",
                  borderRadius: BANNER_RADIUS,
                  overflow: "hidden",
                  backgroundColor: "#171518",
                }}
              >
                <Image
                  source={item.image}
                  style={[
                    StyleSheet.absoluteFill,
                    { width: cardWidth, height: cardHeight },
                  ]}
                  resizeMode="cover"
                />

                {/* Overlay escuro para manter o texto legível por cima das imagens */}
                <LinearGradient
                  colors={["rgba(0,0,0,0.10)", "rgba(0,0,0,0.85)"]}
                  start={{ x: 0, y: 0.05 }}
                  end={{ x: 0, y: 1 }}
                  style={StyleSheet.absoluteFill}
                  pointerEvents="none"
                />

                <View
                  className="justify-end p-4"
                  style={StyleSheet.absoluteFill}
                  pointerEvents="box-none"
                >
                  <View>
                    <Text
                      className="font-golos text-xs uppercase text-white/70"
                      numberOfLines={1}
                    >
                      {item.subtitle}
                    </Text>
                    <Text
                      className="mt-1 font-sans text-2xl text-white"
                      numberOfLines={2}
                      style={{ letterSpacing: 0.3 }}
                    >
                      {item.title}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
};
