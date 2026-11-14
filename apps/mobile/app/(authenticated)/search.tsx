import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { ActivityIndicator, Keyboard, Text, View } from "react-native";
import { ProductGrid } from "@/components/product/product-grid";
import { SearchHeader } from "@/components/search/search-header";
import { SearchSuggestions } from "@/components/search/search-suggestions";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useInfiniteList } from "@/hooks/use-infinite-list";
import { useInfiniteProducts } from "@/hooks/use-infinite-products";
import { colors } from "@/lib/theme";
import { useHelp } from "@/providers/help-provider";

const SEARCH_PAGE_SIZE = 20;
const DEBOUNCE_MS = 300;

export default function SearchScreen() {
  const router = useRouter();
  const { openHelp } = useHelp();
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query, DEBOUNCE_MS);

  const trimmedQuery = debouncedQuery.trim();
  const isSearching = trimmedQuery.length > 0;
  const isWaitingDebounce = query.trim() !== trimmedQuery;

  const productsQuery = useInfiniteProducts(
    isSearching ? { search: trimmedQuery, pageSize: SEARCH_PAGE_SIZE } : {},
    { enabled: isSearching },
  );

  const {
    isPending,
    isError,
    isFetchingNextPage,
    hasNextPage,
    refetch,
    isRefetching,
  } = productsQuery;

  const { items, totalItems, handleEndReached } = useInfiniteList(productsQuery, {
    enabled: isSearching,
  });

  const handleSuggestionPress = (suggestion: string) => {
    Keyboard.dismiss();
    setQuery(suggestion);
  };

  return (
    <View className="flex-1 bg-black">
      <StatusBar style="light" />

      <SearchHeader
        query={query}
        onChangeQuery={setQuery}
        onPressBack={() => router.back()}
        onPressHelp={openHelp}
      />

      {!isSearching ? (
        <SearchSuggestions onSuggestionPress={handleSuggestionPress} />
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
