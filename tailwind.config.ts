import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // brand teal — derived from the real "my anemone" logo (#08adc2)
        brand: {
          50: "#eafbfb",
          100: "#d2f3f5",
          200: "#a6e6ea",
          300: "#6fd3db",
          400: "#35b9c6",
          500: "#0fa0af",
          600: "#0b8494",
          700: "#0a6b78",
          800: "#0b535d",
          900: "#0c3e45",
        },
        // brand magenta — the logo's "anemone" wordmark color (#dc1964), reserved
        // for the one celebratory/delight moment (added-to-cart, order success)
        magenta: {
          50: "#fdeef4",
          100: "#fbd6e4",
          200: "#f6afc9",
          300: "#ef7faa",
          400: "#e54f8c",
          500: "#dc1f71",
          600: "#c21361",
          700: "#9e0e4f",
          800: "#7a0b3e",
          900: "#530829",
        },
        // gold — the logo's arc color (#fec106), used for "terbatas" warning
        warning: {
          50: "#fff8e1",
          100: "#ffedb3",
          200: "#ffde7a",
          300: "#ffcb3d",
          400: "#fdbb0e",
          500: "#e8a400",
          600: "#c17f00",
          700: "#8f5d02",
          800: "#6b4502",
          900: "#4a3001",
        },
        // warm brick red — kept clearly distinct from brand magenta
        danger: {
          50: "#fdecea",
          100: "#fbd2cc",
          200: "#f5a79c",
          300: "#ed7a69",
          400: "#e14f3b",
          500: "#c93a26",
          600: "#a62e1d",
          700: "#832417",
          800: "#5f1a10",
          900: "#3d110a",
        },
        // emerald — semantic "done/success", distinct from brand magenta on purpose
        success: {
          50: "#eaf7ee",
          100: "#cbebd4",
          200: "#99d6aa",
          300: "#64bd7d",
          400: "#3d9f5c",
          500: "#2c8348",
          600: "#21693a",
          700: "#1a5230",
          800: "#143e25",
          900: "#0e2c1a",
        },
        // periwinkle — "dikirim" status, distinct from both brand teal and magenta
        info: {
          50: "#eef0fc",
          100: "#d6dbf7",
          200: "#aeb7ef",
          300: "#838fe3",
          400: "#5e6cd6",
          500: "#4450c4",
          600: "#3640a3",
          700: "#2b3382",
          800: "#212760",
          900: "#171a42",
        },
        // warm paper gray, instead of a cold Tailwind stone/gray default
        neutral: {
          50: "#fdfbf7",
          100: "#f7f2ea",
          200: "#ece4d6",
          300: "#dbd0bc",
          400: "#b8aa8e",
          500: "#8f8168",
          600: "#6b5f49",
          700: "#4f4636",
          800: "#362f25",
          900: "#211c16",
        },
      },
      borderRadius: {
        md: "10px",
        lg: "16px",
      },
      fontFamily: {
        heading: ["var(--font-baloo)", "sans-serif"],
        sans: ["var(--font-inter)", "sans-serif"],
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "modal-in": {
          from: { opacity: "0", transform: "scale(0.96)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        "sheet-in": {
          from: { transform: "translateY(100%)" },
          to: { transform: "translateY(0)" },
        },
        bump: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.03)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.15s ease-out",
        "modal-in": "modal-in 0.18s ease-out",
        "sheet-in": "sheet-in 0.25s ease-out",
        bump: "bump 0.25s ease-out",
      },
    },
  },
  plugins: [],
};
export default config;
