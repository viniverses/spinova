import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import type { ComponentProps } from "react";

import { AppTabBar, type AppTab } from "./app-tab-bar";
import { colors } from "@/lib/theme";

type AppTabScreen = ComponentProps<typeof Tabs.Screen>;
type TabScreen = Pick<AppTabScreen, "name"> & {
  title: string;
  icon: ComponentProps<typeof Ionicons>["name"];
};

const tabScreens: (TabScreen & AppTab)[] = [
  {
    name: "home",
    title: "Início",
    icon: "home-outline",
  },
  {
    name: "lists",
    title: "Categorias",
    icon: "list",
  },
  {
    name: "wishlist",
    title: "Favoritos",
    icon: "heart-outline",
  },
  {
    name: "profile",
    title: "Perfil",
    icon: "person-outline",
  },
];

export const AppTabs = () => (
  <Tabs
    screenOptions={{
      headerShown: false,
      sceneStyle: { backgroundColor: "#000000" },
      tabBarActiveTintColor: colors.primary.DEFAULT,
      tabBarInactiveTintColor: "#A3A3A3",
      tabBarStyle: {
        backgroundColor: "transparent",
        borderTopWidth: 0,
        elevation: 0,
        shadowOpacity: 0,
      },
    }}
    tabBar={(props) => <AppTabBar {...props} tabs={tabScreens} />}
  >
    {tabScreens.map(({ name, title, icon }) => (
      <Tabs.Screen
        key={name}
        name={name}
        options={{
          title,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name={icon} size={size} color={color} />
          ),
        }}
      />
    ))}
    <Tabs.Screen name="collection/[id]" options={{ href: null }} />
  </Tabs>
);
