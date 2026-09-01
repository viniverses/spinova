import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export type HomeBottomNavTab = "home" | "list" | "heart" | "profile";

type HomeBottomNavProps = {
  activeTab?: HomeBottomNavTab;
  onPressCart?: () => void;
};

export const HomeBottomNav = ({
  activeTab,
  onPressCart,
}: HomeBottomNavProps) => {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const handleTabPress = (tab: HomeBottomNavTab) => {
    if (tab === "home") {
      if (activeTab !== "home") {
        router.push("/home");
      }
      return;
    }
    if (tab === "heart") {
      if (activeTab !== "heart") {
        router.push("/wishlist");
      }
      return;
    }
    if (tab === "profile") {
      router.push("/profile");
      return;
    }

    // Rotas futuras: listas, favoritos, etc.
  };

  const handleCartPress = () => {
    if (onPressCart) {
      onPressCart();
      return;
    }
    router.push("/cart");
  };

  return (
    <View
      className="absolute bottom-0 left-0 right-0 bg-[#2C2C2E]"
      style={{
        paddingBottom: Math.max(insets.bottom, 10),
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingTop: 10,
      }}
    >
      <View className="relative flex-row items-center justify-between px-6">
        <Pressable
          onPress={() => handleTabPress("home")}
          accessibilityRole="tab"
          accessibilityState={{ selected: activeTab === "home" }}
          accessibilityLabel="Início"
          className="min-w-[52px] items-center py-1 active:opacity-80"
        >
          <Ionicons
            name="home"
            size={26}
            color={activeTab === "home" ? "#E14842" : "#A3A3A3"}
          />
          {activeTab === "home" ? (
            <View className="mt-1 h-0.5 w-6 rounded-full bg-primary" />
          ) : (
            <View className="mt-1 h-0.5 w-6" />
          )}
        </Pressable>

        <Pressable
          onPress={() => handleTabPress("list")}
          accessibilityRole="tab"
          accessibilityState={{ selected: activeTab === "list" }}
          accessibilityLabel="Listas"
          className="min-w-[52px] items-center py-1 active:opacity-80"
        >
          <Ionicons
            name="list"
            size={26}
            color={activeTab === "list" ? "#E14842" : "#A3A3A3"}
          />
          {activeTab === "list" ? (
            <View className="mt-1 h-0.5 w-6 rounded-full bg-primary" />
          ) : (
            <View className="mt-1 h-0.5 w-6" />
          )}
        </Pressable>

        <View style={{ width: 64 }} />

        <Pressable
          onPress={() => handleTabPress("heart")}
          accessibilityRole="tab"
          accessibilityState={{ selected: activeTab === "heart" }}
          accessibilityLabel="Favoritos"
          className="min-w-[52px] items-center py-1 active:opacity-80"
        >
          <Ionicons
            name="heart-outline"
            size={26}
            color={activeTab === "heart" ? "#E14842" : "#A3A3A3"}
          />
          {activeTab === "heart" ? (
            <View className="mt-1 h-0.5 w-6 rounded-full bg-primary" />
          ) : (
            <View className="mt-1 h-0.5 w-6" />
          )}
        </Pressable>

        <Pressable
          onPress={() => handleTabPress("profile")}
          accessibilityRole="tab"
          accessibilityState={{ selected: activeTab === "profile" }}
          accessibilityLabel="Perfil"
          className="min-w-[52px] items-center py-1 active:opacity-80"
        >
          <Ionicons
            name="person-outline"
            size={26}
            color={activeTab === "profile" ? "#E14842" : "#A3A3A3"}
          />
          {activeTab === "profile" ? (
            <View className="mt-1 h-0.5 w-6 rounded-full bg-primary" />
          ) : (
            <View className="mt-1 h-0.5 w-6" />
          )}
        </Pressable>
      </View>

      <Pressable
        onPress={handleCartPress}
        accessibilityRole="button"
        accessibilityLabel="Carrinho"
        className="absolute h-14 w-14 items-center justify-center rounded-full bg-primary active:opacity-90"
        style={{
          top: -26,
          left: "50%",
          marginLeft: -28,
          elevation: 8,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.35,
          shadowRadius: 6,
        }}
      >
        <Ionicons name="cart" size={28} color="#111111" />
      </Pressable>
    </View>
  );
};
