import { createAuthClient } from "better-auth/react";
import { expoClient } from "@better-auth/expo/client";
import * as SecureStore from "expo-secure-store";
import { apiUrl } from "./api-url";

export const authClient = createAuthClient({
  baseURL: apiUrl,
  plugins: [
    expoClient({
      scheme: "spinova-app",
      storagePrefix: "spinova-app",
      storage: SecureStore,
    }),
  ],
});

export type Session = typeof authClient.$Infer.Session;
