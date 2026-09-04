import { Platform } from "react-native";
import { env } from "@spinova/env/mobile";

export const apiBaseUrl =
  Platform.OS === "web" ? env.EXPO_PUBLIC_WEB_API_URL : env.EXPO_PUBLIC_API_URL;
