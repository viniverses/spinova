import { Redirect } from "expo-router";
import { View } from "react-native";
import { useSession } from "../src/hooks/use-auth";

export default function Index() {
  const { data, isPending } = useSession();

  if (isPending) {
    return <View className="flex-1 bg-[#171518]" />;
  }

  if (data?.user) {
    return <Redirect href="/home" />;
  }

  return <Redirect href="/login" />;
}
