// /** @type {import('tailwindcss').Config} */
// export default {
//   content: [],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// }



/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        payuGreen: "#16a085", // tweak if needed
        payuGray: "#f6f7f7",
        formBorder: "#e6e6e6",
      },
      boxShadow: {
        'card': '0 8px 18px rgba(0,0,0,0.08)'
      },
      spacing: {
        '72': '18rem',
        '84': '21rem',
      }
    },
  },
  plugins: [],
}
