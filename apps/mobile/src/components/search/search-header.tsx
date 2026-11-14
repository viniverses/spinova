import { Ionicons } from "@expo/vector-icons";
import { useRef } from "react";
import { Pressable, TextInput, View } from "react-native";
import { NavigationHeader } from "@/components/navigation/navigation-header";

type SearchHeaderProps = {
  query: string;
  onChangeQuery: (query: string) => void;
  onPressBack: () => void;
  onPressHelp: () => void;
};

export const SearchHeader = ({
  query,
  onChangeQuery,
  onPressBack,
  onPressHelp,
}: SearchHeaderProps) => {
  const inputRef = useRef<TextInput | null>(null);

  return (
    <NavigationHeader
      safeArea
      className="pb-3 pt-1"
      onPressBack={onPressBack}
      onPressHelp={onPressHelp}
    >
      <View className="h-12 flex-1 flex-row items-center rounded-2xl bg-surface-control px-3.5">
        <Ionicons name="search" size={20} color="#A3A3A3" />
        <TextInput
          ref={inputRef}
          value={query}
          onChangeText={onChangeQuery}
          placeholder="Buscar artista ou álbum..."
          placeholderTextColor="#8E8E93"
          returnKeyType="search"
          autoFocus
          autoCorrect={false}
          autoCapitalize="none"
          accessibilityLabel="Buscar produtos por artista ou álbum"
          className="flex-1 px-2.5 py-0 font-golos text-sm text-white"
          style={{ paddingVertical: 0 }}
        />
        {query.length > 0 ? (
          <Pressable
            onPress={() => {
              onChangeQuery("");
              inputRef.current?.focus();
            }}
            accessibilityRole="button"
            accessibilityLabel="Limpar busca"
            hitSlop={8}
            className="p-1 active:opacity-70"
          >
            <Ionicons name="close-circle" size={18} color="#A3A3A3" />
          </Pressable>
        ) : null}
      </View>
    </NavigationHeader>
  );
};
