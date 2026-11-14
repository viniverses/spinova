import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, useWindowDimensions, View } from "react-native";
import { CategoryCard } from "@/components/categories/category-card";
import {
  CATEGORY_BUTTONS,
  FEATURED_COLLECTIONS,
} from "@/constants/collections";

const CONTENT_HORIZONTAL_PADDING = 20;
const GRID_GAP = 12;
const MAX_CONTENT_WIDTH = 520;
const BOTTOM_NAV_CLEARANCE = 116;

export default function CategoriesScreen() {
  const router = useRouter();
  const { width, fontScale } = useWindowDimensions();
  const contentWidth = Math.min(
    width - CONTENT_HORIZONTAL_PADDING * 2,
    MAX_CONTENT_WIDTH,
  );
  const featuredWidth = (contentWidth - GRID_GAP) / 2;
  const genreColumns = contentWidth < 320 || fontScale > 1.2 ? 2 : 3;
  const filterWidth =
    (contentWidth - GRID_GAP * (genreColumns - 1)) / genreColumns;

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
          {FEATURED_COLLECTIONS.map((category) => (
            <Pressable
              key={category.id}
              onPress={() => router.push(category.href)}
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
            <CategoryCard
              key={category.id}
              onPress={() => router.push(category.href)}
              label={category.label}
              icon={category.icon}
              featured={category.featured}
              width={filterWidth}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
