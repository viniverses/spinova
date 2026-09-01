import { Redirect } from "expo-router";
import { View } from "react-native";
import { AppTabs } from "@/components/navigation/app-tabs";
import { useSession } from "@/hooks/use-auth";

export default function AuthenticatedLayout() {
  const { data, isPending } = useSession();

  if (isPending) {
    return <View className="flex-1 bg-[#171518]" />;
  }

  if (!data?.user) {
    return <Redirect href="/login" />;
  }

  return (
    <View className="flex-1 bg-black">
      <AppTabs />
    </View>
  );
}
