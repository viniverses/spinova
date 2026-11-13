import { Ionicons } from "@expo/vector-icons";
import { Pressable, ScrollView, Text, View } from "react-native";
import { colors } from "@/lib/theme";

const POPULAR_SUGGESTIONS = [
  "SZA",
  "Björk",
  "Bad Bunny",
  "Tyler, The Creator",
  "Caroline Polachek",
  "The xx",
  "SOS",
  "MOTOMAMI",
  "Flower Boy",
  "Fossora",
];

type SearchSuggestionsProps = {
  onSuggestionPress: (suggestion: string) => void;
};

export const SearchSuggestions = ({
  onSuggestionPress,
}: SearchSuggestionsProps) => {
  return (
    <ScrollView
      className="flex-1 px-4 pt-6"
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ paddingBottom: 120 }}
    >
      <View className="items-center py-6">
        <View className="h-16 w-16 items-center justify-center rounded-full bg-[#2C2C2E]">
          <Ionicons name="search" size={28} color={colors.primary.DEFAULT} />
        </View>
        <Text className="mt-4 font-sans text-xl text-white">
          O que você quer ouvir?
        </Text>
        <Text className="mt-1 max-w-[280px] text-center font-golos text-sm text-white/60">
          Busque por nome do artista ou álbum no catálogo da Spinova.
        </Text>
      </View>

      <View className="mt-6 items-center">
        <Text className="mb-3 text-center font-sans text-xs tracking-wider text-white/60 uppercase">
          Sugestões de busca
        </Text>
        <View className="flex-row flex-wrap justify-center gap-2">
          {POPULAR_SUGGESTIONS.map((suggestion) => (
            <Pressable
              key={suggestion}
              onPress={() => onSuggestionPress(suggestion)}
              accessibilityRole="button"
              accessibilityLabel={`Buscar ${suggestion}`}
              className="flex-row items-center gap-1.5 rounded-full bg-[#2C2C2E] px-4 py-2 active:opacity-75"
            >
              <Ionicons name="search-outline" size={14} color="#A3A3A3" />
              <Text className="font-golos text-sm text-white">
                {suggestion}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};
