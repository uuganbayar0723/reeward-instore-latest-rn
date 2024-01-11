/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#EB4689',
        textGray: '#5A5C67',
        bgGray: "#F7F7F7"
      },
      spacing: {
        screenPadding: '14px',
        screenTop: '10px'
      }
    },
  },
  plugins: [],
};
