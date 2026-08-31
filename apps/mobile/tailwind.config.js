/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#E14842",
          foreground: "#211719",
          soft: "#E14842",
        },
        error: "#FF9B96",
      },
      fontFamily: {
        sans: ["Syne_700Bold", "Syne_400Regular", "System"],
        golos: ["GolosText-Regular", "System"],
        "golos-semibold": ["GolosText-SemiBold", "GolosText-Regular", "System"],
        syne: ["Syne_400Regular", "System"],
        "syne-bold": ["Syne_700Bold", "Syne_400Regular", "System"],
      },
    },
  },
  plugins: [],
};
