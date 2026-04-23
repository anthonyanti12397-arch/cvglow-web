import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f8f7ff",
          100: "#ede8ff",
          200: "#dcd5ff",
          300: "#c3b2ff",
          400: "#a785ff",
          500: "#8f5ff7",
          600: "#8239f5",
          700: "#6d1ee8",
          800: "#5a15c8",
          900: "#4a0fad",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
