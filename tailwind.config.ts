import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        uemg: {
          primary: '#0B3B60',
          dark: '#003366',
          accent: '#0056B3',
          light: '#E6EFF7',
          surface: '#F7F9FC',
        },
        gov: {
          blue: '#0B3B60',
          yellow: '#FFCC00',
          green: '#00853B',
          red: '#C53030',
        },
      },
      fontFamily: {
        sans: ['Open Sans', 'Segoe UI', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
