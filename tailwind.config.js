/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "dark-purple": "#1a0033",
        "medium-purple": "#330066",
        "accent-purple": "#6600cc",
        "blue-start": "#1e3a8a",
        "purple-end": "#7c3aed",
      },
      backgroundImage: {
        "gradient-dark":
          "linear-gradient(135deg, #000000 0%, #1a0033 50%, #330066 100%)",
        "gradient-blue-purple":
          "linear-gradient(135deg, #1e3a8a 0%, #7c3aed 100%)",
        "gradient-black-blue-purple":
          "linear-gradient(135deg, #000000 0%, #1e3a8a 50%, #7c3aed 100%)",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "Arial", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};
