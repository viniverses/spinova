import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
  },
  format: ["esm"],
  dts: true,
  clean: true,
  sourcemap: true,
  external: ["better-auth", "drizzle-orm", "@repo/database", "@package/env"],
});
