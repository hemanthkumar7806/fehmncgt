/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'holy-name-blue': '#093b60',
        'holy-name-green': '#01a69c',
        'holy-name-blue-light': '#0f5a8a',
        'holy-name-green-light': '#02c4b8',
        'holy-name-gray': '#f8fafc',
        'holy-name-text': '#1e293b',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
