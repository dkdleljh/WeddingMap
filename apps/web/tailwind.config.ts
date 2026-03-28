import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0F766E",
        accent: "#F59E0B",
        soft: "#FFF7ED",
        ink: "#111827"
      },
      boxShadow: {
        card: "0 18px 40px rgba(15, 23, 42, 0.08)"
      },
      borderRadius: {
        panel: "1.5rem"
      }
    }
  },
  plugins: []
};

export default config;
