import { env } from "@spinova/env/mobile";
import { Platform } from "react-native";

export const apiUrl =
  Platform.OS === "web" ? env.EXPO_PUBLIC_WEB_API_URL : env.EXPO_PUBLIC_API_URL;
