import { authClient } from "@/lib/auth-client";
import { apiBaseUrl } from "@/lib/api-base-url";
import axios from "axios";
import { Platform } from "react-native";

export const api = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    Accept: "application/json",
  },
  withCredentials: Platform.OS === "web",
});

api.interceptors.request.use(async (config) => {
  if (Platform.OS === "web") {
    return config;
  }

  const cookies = await authClient.getCookie();

  if (cookies) {
    config.headers.Cookie = cookies;
  }

  return config;
});
