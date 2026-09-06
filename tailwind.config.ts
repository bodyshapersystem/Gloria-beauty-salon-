import type { Config } from "tailwindcss";

// Approved Gloria Beauty Salon brand palette — do not change without
// explicit sign-off (see FINAL APPROVED BRAND & DIGITAL ECOSYSTEM SPECIFICATION).
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: "#F8F5EF",
        champagne: "#D4B896",
        taupe: "#A68F7B",
        mocha: "#6B4F43",
        espresso: "#2E2724",
        blush: "#EAD6D1",
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "serif"],
        sans: ["var(--font-manrope)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
