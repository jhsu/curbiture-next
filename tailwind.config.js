module.exports = {
  purge: {
    layers: ["base", "utilities", "components"],
    content: ["./components/**/*.tsx", "./pages/**/*.tsx", "./hooks/*.ts"],
  },
  theme: {
    extend: {
      colors: {},
      fontFamily: {
        sans: ["Roboto", "sans-serif"],
        heading: ['"Open Sans"', "Roboto", "sans-serif"],
      },
    },
  },
};
