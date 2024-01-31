/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#EB4689',
        textGray: '#5A5C67',
        textDarkerGray: '#454857',
        bgGray: "#F7F7F7",
        inputGray: '#EFEFEF'
      },
      spacing: {
        screenPadding: '14px',
        screenTop: '20px'
      }
    },
  },
  plugins: [],
};
