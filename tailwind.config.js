/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/views/**/*.hbs',
    './src/**/*.ts',
    './public/js/**/*.js',
    './node_modules/flowbite/**/*.js',
  ],
  theme: {
    extend: {
      colors: {
        teal: {
          50: '#adffff',
          100: '#00f5f5',
          200: '#00d2d2',
          300: '#00b4b4',
          400: '#009898',
          500: '#007a7a',
          600: '#006060',
          700: '#004949',
          800: '#003434',
          900: '#001f1f',
          1000: '#001818',
          1100: '#000f0f',
        },
      },
    },
  },
  plugins: [require('flowbite/plugin')],
};
