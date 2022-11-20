/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}',"./node_modules/flowbite/**/*.js"],
  plugins: [
      require('flowbite/plugin')
  ],
  darkMode: 'class',
};