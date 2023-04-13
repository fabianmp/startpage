/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['index.html'],
  theme: {
    extend: {},
  },
  plugins: [],
  safelist: [
    {
      pattern: /bg-(red|blue|green|yellow|purple|gray|pink)-(.00)$/,
    },
    {
      pattern: /border-(red|blue|green|yellow|purple|gray|pink)-(.00)$/,
      variants: ['lg'],
    },
  ]
}

