import { createAuthClient } from "better-auth/react";
import { expoClient } from "@better-auth/expo/client";
import { env } from "@spinova/env/mobile";
import * as SecureStore from "expo-secure-store";

export const authClient = createAuthClient({
  baseURL: env.EXPO_PUBLIC_API_URL,
  plugins: [
    expoClient({
      scheme: "spinova-app",
      storagePrefix: "spinova-app",
      storage: SecureStore,
    }),
  ],
});

export type Session = typeof authClient.$Infer.Session;
