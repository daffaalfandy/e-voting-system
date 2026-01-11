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
        'deep-slate': '#0F172A',
        'indonesian-red': '#D00C0C',
        'coblos-green': '#16A34A',
        'paper-white': '#F8FAFC',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      minHeight: {
        'touch': '60px',
      },
      minWidth: {
        'touch': '60px',
      },
    },
  },
  plugins: [],
};

export default config;
