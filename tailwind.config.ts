import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // 1. REGISTER YOUR FONTS
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'], // Default UI font
        montserrat: ['var(--font-montserrat)', 'sans-serif'], // Branding/Headings
        poppins: ['var(--font-poppins)', 'sans-serif'], // Body content
      },
    },
  },
  plugins: [],
};

export default config;
