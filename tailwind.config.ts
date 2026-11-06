import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        cream: "#F7F8F3",
        charcoal: "#171A16",
        lime: "#D9FF70",
        muted: "#777D72",
        border: "#E6E8DF",
        success: "#287A4B",
        error: "#C34437",
      },
      fontFamily: { sans: ["Arial", "Inter", "sans-serif"] },
    },
  },
  plugins: [],
};

export default config;
