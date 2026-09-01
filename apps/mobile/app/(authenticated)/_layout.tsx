import { Redirect, Stack, usePathname } from "expo-router";
import { View } from "react-native";
import {
  HomeBottomNav,
  type HomeBottomNavTab,
} from "@/components/home/home-bottom-nav";
import { useSession } from "@/hooks/use-auth";

const getActiveTab = (pathname: string): HomeBottomNavTab | undefined => {
  if (pathname === "/home") return "home";
  if (pathname === "/lists") return "list";
  if (pathname === "/wishlist") return "heart";
  if (pathname === "/profile") return "profile";

  return undefined;
};

export default function AuthenticatedLayout() {
  const { data, isPending } = useSession();
  const pathname = usePathname();

  if (isPending) {
    return <View className="flex-1 bg-[#171518]" />;
  }

  if (!data?.user) {
    return <Redirect href="/login" />;
  }

  return (
    <View className="flex-1 bg-black">
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
        }}
      />
      <HomeBottomNav activeTab={getActiveTab(pathname)} />
    </View>
  );
}
