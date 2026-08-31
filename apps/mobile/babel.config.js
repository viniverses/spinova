module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      // worklets: false evita o plugin duplicado; o Reanimated entra só em `plugins` (por último).
      ["babel-preset-expo", { jsxImportSource: "nativewind", worklets: false }],
      "nativewind/babel",
    ],
    plugins: [
      "@babel/plugin-proposal-export-namespace-from",
      "expo-router/babel",
      "react-native-reanimated/plugin",
    ],
  };
};
