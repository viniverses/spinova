import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import type { ComponentProps } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { colors } from "@/lib/theme";

const FEATURED_CATEGORIES = [
  {
    id: "bestsellers",
    label: "Mais vendidos",
    image: require("../../assets/categories/best-sellers.png"),
  },
  {
    id: "promo",
    label: "Promoções",
    image: require("../../assets/categories/sales.png"),
  },
  {
    id: "national",
    label: "Nacionais",
    image: require("../../assets/categories/national.png"),
  },
  {
    id: "import",
    label: "Importados",
    image: require("../../assets/categories/imported.png"),
  },
] as const;

const GENRE_CATEGORIES = [
  { id: "new", label: "Novos", icon: "sparkles" },
  { id: "r-and-b", label: "RNB", icon: "musical-notes" },
  { id: "electronic", label: "Eletrônico", icon: "pulse" },
  { id: "pop", label: "Pop", icon: "mic" },
  {
    id: "alternative",
    label: "Alternativo",
    icon: "color-wand-outline",
  },
  { id: "rock", label: "Rock", icon: "flash" },
  { id: "folk", label: "Country", icon: "leaf-outline" },
  { id: "rap", label: "Hip Hop", icon: "mic-outline" },
  { id: "city-pop", label: "City Pop", icon: "moon-outline" },
  { id: "reggaeton", label: "Reggaeton", icon: "flame" },
  { id: "experimental", label: "Experimental", icon: "flask-outline" },
];

const ALL_PRODUCTS_CATEGORY = {
  id: "all",
  label: "Todos",
  icon: "grid-outline",
  featured: true,
} as const;

// Keep this derived list so “Todos os produtos” is always rendered last.
const CATEGORY_BUTTONS = [...GENRE_CATEGORIES, ALL_PRODUCTS_CATEGORY] as const;

const CONTENT_HORIZONTAL_PADDING = 20;
const GRID_GAP = 12;
const MAX_CONTENT_WIDTH = 520;
const BOTTOM_NAV_CLEARANCE = 116;

export default function CategoriesScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const contentWidth = Math.min(
    width - CONTENT_HORIZONTAL_PADDING * 2,
    MAX_CONTENT_WIDTH,
  );
  const featuredWidth = (contentWidth - GRID_GAP) / 2;
  const filterWidth = (contentWidth - GRID_GAP * 2) / 3;

  const openCollection = (id: string) => {
    router.push(`/collection/${id}` as never);
  };

  return (
    <View className="flex-1 bg-black">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          alignItems: "center",
          paddingTop: 12,
          paddingBottom: BOTTOM_NAV_CLEARANCE,
        }}
      >
        <View
          className="flex-row flex-wrap"
          style={{
            width: contentWidth,
            gap: GRID_GAP,
          }}
        >
          {FEATURED_CATEGORIES.map((category) => (
            <Pressable
              key={category.id}
              onPress={() => openCollection(category.id)}
              accessibilityRole="button"
              accessibilityLabel={`Ver ${category.label}`}
              className="overflow-hidden rounded-xl active:opacity-85"
              style={{ width: featuredWidth, aspectRatio: 165 / 188 }}
            >
              <Image
                source={category.image}
                contentFit="cover"
                transition={120}
                style={{ width: "100%", height: "100%" }}
              />
            </Pressable>
          ))}
        </View>

        <View
          className="mt-6 flex-row flex-wrap"
          style={{
            width: contentWidth,
            gap: GRID_GAP,
          }}
        >
          {CATEGORY_BUTTONS.map((category) => (
            <Pressable
              key={category.id}
              onPress={() => openCollection(category.id)}
              accessibilityRole="button"
              accessibilityLabel={category.label.replace("\n", " ")}
              className={`min-h-[60] flex-row items-center justify-center gap-1.5 rounded-xl px-2 active:opacity-85 ${
                "featured" in category && category.featured
                  ? "bg-primary"
                  : "bg-[#F2F2F4]"
              }`}
              style={{ width: filterWidth }}
            >
              <Ionicons
                name={category.icon as ComponentProps<typeof Ionicons>["name"]}
                size={16}
                color={
                  "featured" in category && category.featured
                    ? "#FFFFFF"
                    : colors.primary.DEFAULT
                }
              />
              <Text
                className={`text-center font-golos-semibold text-[13] leading-4 ${
                  "featured" in category && category.featured
                    ? "text-white"
                    : "text-[#28262A]"
                }`}
              >
                {category.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
