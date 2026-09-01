import { authClient } from "@/lib/auth-client";
import axios from "axios";
import { Platform } from "react-native";
import { apiUrl } from "../lib/api-url";

export const api = axios.create({
  baseURL: apiUrl,
  headers: {
    Accept: "application/json",
  },
  withCredentials: true,
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
