import { Tabs } from "expo-router";
import type { ComponentProps } from "react";
import { Platform } from "react-native";

import { AppTabBar, type AppTab } from "./app-tab-bar";
import { colors } from "@/lib/theme";

type AppTabScreen = ComponentProps<typeof Tabs.Screen>;
type TabScreen = Pick<AppTabScreen, "name"> & {
  title: string;
};

const tabScreens: (TabScreen & AppTab)[] = [
  {
    name: "home",
    title: "Início",
  },
  {
    name: "lists",
    title: "Categorias",
  },
  {
    name: "wishlist",
    title: "Favoritos",
  },
  {
    name: "profile",
    title: "Perfil",
  },
];

export const AppTabs = () => (
  <Tabs
    backBehavior="history"
    screenOptions={{
      headerShown: false,
      sceneStyle: { backgroundColor: "#000000" },
      tabBarActiveTintColor: colors.primary.DEFAULT,
      tabBarInactiveTintColor: "#A3A3A3",
      tabBarStyle: {
        backgroundColor: "transparent",
        borderTopWidth: 0,
        ...Platform.select({
          web: { boxShadow: "none" },
          default: { elevation: 0, shadowOpacity: 0 },
        }),
      },
    }}
    tabBar={(props) => <AppTabBar {...props} tabs={tabScreens} />}
  >
    {tabScreens.map(({ name, title }) => (
      <Tabs.Screen
        key={name}
        name={name}
        options={{
          title,
        }}
      />
    ))}
    <Tabs.Screen name="search" />
    <Tabs.Screen name="collection/[id]" />
    <Tabs.Screen name="product/[id]" />
    <Tabs.Screen name="cart" />
    <Tabs.Screen name="checkout" />
    <Tabs.Screen name="address" />
    <Tabs.Screen name="order-complete" />
    <Tabs.Screen name="orders" />
    <Tabs.Screen name="order/[id]" />
    <Tabs.Screen name="help/[id]" />
  </Tabs>
);
