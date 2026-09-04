import { Image } from "expo-image";
import { useRouter } from "expo-router";
import type { ComponentProps } from "react";
import { Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type TabsProps = ComponentProps<typeof import("expo-router").Tabs>;
type AppTabBarProps = Parameters<NonNullable<TabsProps["tabBar"]>>[0];

export type AppTab = {
  name: string;
  title: string;
};

type AppTabBarPropsWithTabs = AppTabBarProps & {
  tabs: AppTab[];
};

const TAB_ICONS = {
  home: require("../../../assets/svg/home.svg"),
  lists: require("../../../assets/svg/categories.svg"),
  wishlist: require("../../../assets/svg/wishlist.svg"),
  profile: require("../../../assets/svg/profile.svg"),
} as const;

export const AppTabBar = ({
  state,
  navigation,
  tabs,
}: AppTabBarPropsWithTabs) => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const activeRouteName = state.routes[state.index]?.name;

  const handleTabPress = (name: string) => {
    const route = state.routes.find(
      (currentRoute) => currentRoute.name === name,
    );

    if (!route) return;

    const event = navigation.emit({
      type: "tabPress",
      target: route.key,
      canPreventDefault: true,
    });

    if (activeRouteName !== name && !event.defaultPrevented) {
      navigation.navigate(route.name);
    }
  };

  return (
    <View
      className="absolute bottom-0 left-0 right-0 bg-[#2C2C2E]"
      style={{
        paddingBottom: Math.max(insets.bottom, 10),
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        paddingTop: 14,
      }}
    >
      <View className="relative flex-row items-center justify-between px-6">
        {tabs.map((tab, index) => {
          const isActive = activeRouteName === tab.name;

          return (
            <View key={tab.name} className="flex-row items-center">
              {index === 2 ? <View style={{ width: 72 }} /> : null}
              <Pressable
                onPress={() => handleTabPress(tab.name)}
                accessibilityRole="tab"
                accessibilityState={{ selected: isActive }}
                accessibilityLabel={tab.title}
                className="min-w-[52px] items-center py-1 active:opacity-80"
              >
                <Image
                  source={TAB_ICONS[tab.name as keyof typeof TAB_ICONS]}
                  contentFit="contain"
                  style={{ width: 28, height: 28 }}
                  accessible={false}
                />
                <View
                  className={`mt-1 h-0.5 w-6 rounded-full ${
                    isActive ? "bg-primary" : "bg-transparent"
                  }`}
                />
              </Pressable>
            </View>
          );
        })}
      </View>

      <Pressable
        onPress={() => router.push("/cart" as never)}
        accessibilityRole="button"
        accessibilityLabel="Carrinho"
        className="absolute h-[68px] w-[68px] items-center justify-center rounded-full bg-primary active:opacity-90"
        style={{
          top: -23,
          left: "50%",
          marginLeft: -34,
          elevation: 8,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.35,
          shadowRadius: 6,
        }}
      >
        <Image
          source={require("../../../assets/svg/cart.svg")}
          contentFit="contain"
          style={{ width: 29, height: 29 }}
          accessible={false}
        />
      </Pressable>
    </View>
  );
};
