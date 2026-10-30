import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        spatial: {
          main: "#FFFDF5",
          secondary: "#FFF9E8",
          light: "#FFF0B3",
          soft: "#FFE99A",
          cream: "#FFF6D8",
          gold: "#E7B83F",
          goldDark: "#C99A27",
          primary: "#252525",
          secondaryText: "#77736A",
          white: "#FFFFFF",
          border: "#F0E8D4",
        },
      },
      boxShadow: {
        'spatial-sm': '0 2px 8px -1px rgba(180, 140, 40, 0.06), 0 1px 3px rgba(0, 0, 0, 0.03)',
        'spatial': '0 10px 25px -4px rgba(180, 140, 40, 0.08), 0 4px 10px -2px rgba(0, 0, 0, 0.03)',
        'spatial-lg': '0 20px 35px -6px rgba(180, 140, 40, 0.12), 0 8px 16px -4px rgba(0, 0, 0, 0.04)',
        'spatial-float': '0 25px 50px -12px rgba(180, 140, 40, 0.15), 0 10px 20px -5px rgba(0, 0, 0, 0.04)',
      },
      screens: {
        'xs': '375px',
      },
    },
  },
  plugins: [],
};
export default config;
