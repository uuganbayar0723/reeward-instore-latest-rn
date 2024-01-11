/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#EB4689',
        textGray: '#5A5C67'
      },
      spacing: {
        screenPadding: '14px'
      }
    },
  },
  plugins: [],
};
