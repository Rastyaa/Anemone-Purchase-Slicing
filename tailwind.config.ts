import type { Config } from "tailwindcss";
import colors from "tailwindcss/colors";

const config: Config = {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: colors.teal,
        success: colors.green,
        warning: colors.amber,
        danger: colors.red,
        info: colors.blue,
        neutral: colors.stone,
      },
      borderRadius: {
        md: "10px",
        lg: "16px",
      },
      fontFamily: {
        heading: ["var(--font-baloo)", "sans-serif"],
        sans: ["var(--font-inter)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
