import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    main: "src/main.ts",
  },
  outDir: "./dist",
  format: ["esm"],
  platform: "node",
  target: "node24",
  bundle: true,
  clean: false,
  dts: false,
  minify: false,
  external: ["pg"],
  noExternal: [/^@spinova\//],
  sourcemap: true,
  splitting: false,
  treeshake: true,
});
