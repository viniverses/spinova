import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    server: "src/server.ts",
    mobile: "src/mobile.ts",
  },
  format: ["esm"],
  dts: true,
  clean: true,
  sourcemap: true,
});
