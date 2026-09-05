import { Text, View } from "react-native";

type ProductListHeaderProps = {
  title: string;
  totalItems?: number;
};

export const ProductListHeader = ({
  title,
  totalItems,
}: ProductListHeaderProps) => {
  return (
    <View className="px-5 pb-3 pt-2">
      <Text className="font-sans text-2xl font-bold text-white" numberOfLines={1}>
        {title}
      </Text>
      {totalItems !== undefined ? (
        <Text className="mt-0.5 font-golos text-xs text-white/50">
          {totalItems} {totalItems === 1 ? "produto" : "produtos"}
        </Text>
      ) : null}
    </View>
  );
};
