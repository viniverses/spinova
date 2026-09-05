import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ProductGrid } from "@/components/product/product-grid";
import { useInfiniteProducts } from "@/hooks/use-infinite-products";
import { colors } from "@/lib/theme";
import { useHelp } from "@/providers/help-provider";

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

const SEARCH_PAGE_SIZE = 20;
const DEBOUNCE_MS = 300;

export default function SearchScreen() {
  const router = useRouter();
  const { openHelp } = useHelp();
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const inputRef = useRef<TextInput | null>(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, DEBOUNCE_MS);

    return () => clearTimeout(handler);
  }, [query]);

  const trimmedQuery = debouncedQuery.trim();
  const isSearching = trimmedQuery.length > 0;
  const isWaitingDebounce = query.trim() !== trimmedQuery;

  const {
    data,
    isPending,
    isError,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
    isRefetching,
  } = useInfiniteProducts(
    isSearching ? { search: trimmedQuery, pageSize: SEARCH_PAGE_SIZE } : {},
    { enabled: isSearching },
  );

  const items = useMemo(
    () => (isSearching ? data?.pages.flatMap((p) => p.data) ?? [] : []),
    [data, isSearching],
  );

  const totalItems = data?.pages[0]?.pagination.totalItems;

  const handleEndReached = () => {
    if (hasNextPage && !isFetchingNextPage) {
      void fetchNextPage();
    }
  };

  const handleSuggestionPress = (suggestion: string) => {
    Keyboard.dismiss();
    setQuery(suggestion);
  };

  return (
    <View className="flex-1 bg-black">
      <StatusBar style="light" />

      {/* Dedicated Search Header */}
      <SafeAreaView className="bg-black" edges={["top", "left", "right"]}>
        <View className="flex-row items-center gap-3 px-4 pb-3 pt-1">
          <Pressable
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="Voltar"
            className="h-12 w-12 items-center justify-center rounded-2xl bg-[#2C2C2E] active:opacity-90"
          >
            <Ionicons name="chevron-back" size={22} color="#D4D4D4" />
          </Pressable>

          <View className="h-12 flex-1 flex-row items-center rounded-2xl bg-[#2C2C2E] px-3.5">
            <Ionicons name="search" size={20} color="#A3A3A3" />
            <TextInput
              ref={inputRef}
              value={query}
              onChangeText={setQuery}
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
                  setQuery("");
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

          <Pressable
            onPress={openHelp}
            accessibilityRole="button"
            accessibilityLabel="Ajuda"
            className="h-12 w-12 items-center justify-center rounded-2xl bg-[#2C2C2E] active:opacity-90"
          >
            <View className="h-8 w-8 items-center justify-center rounded-full bg-white/10">
              <Ionicons name="help" size={20} color="#D4D4D4" />
            </View>
          </Pressable>
        </View>
      </SafeAreaView>

      {/* Content */}
      {!isSearching ? (
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
                  onPress={() => handleSuggestionPress(suggestion)}
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
      ) : isWaitingDebounce || (isPending && items.length === 0) ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color={colors.primary.DEFAULT} size="large" />
          <Text className="mt-3 font-golos text-sm text-white/50">
            Buscando discos…
          </Text>
        </View>
      ) : (
        <View className="flex-1">
          <ProductGrid
            items={items}
            isLoading={false}
            isError={isError && !isPending}
            isFetchingNextPage={isFetchingNextPage}
            hasNextPage={!!hasNextPage}
            isRefreshing={isRefetching && !isFetchingNextPage}
            onRefresh={() => void refetch()}
            onRetry={() => void refetch()}
            onEndReached={handleEndReached}
            ListHeaderComponent={
              totalItems !== undefined && items.length > 0 ? (
                <View className="pb-2 pt-1">
                  <Text className="font-golos text-xs text-white/50">
                    {totalItems} {totalItems === 1 ? "resultado encontrado" : "resultados encontrados"} para "{trimmedQuery}"
                  </Text>
                </View>
              ) : undefined
            }
            emptyMessage={`Nenhum produto encontrado para "${trimmedQuery}". Tente buscar por outro artista ou álbum.`}
          />
        </View>
      )}
    </View>
  );
}
