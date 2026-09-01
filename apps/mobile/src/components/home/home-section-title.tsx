import { Text, View } from "react-native";

type HomeSectionTitleProps = {
  title: string;
};

export const HomeSectionTitle = ({ title }: HomeSectionTitleProps) => {
  return (
    <View className="mb-3 flex-row items-center justify-between px-4">
      <Text className="font-sans text-lg text-white">{title}</Text>
    </View>
  );
};
