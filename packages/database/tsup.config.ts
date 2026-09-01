import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    query: "src/query.ts",
    schema: "src/schema/index.ts",
  },
  format: ["esm"],
  dts: true,
  clean: true,
  sourcemap: true,
  external: ["drizzle-orm", "pg"],
});
