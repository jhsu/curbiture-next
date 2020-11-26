// eslint-disable-next-line
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
      maxWidth: {
        "1/2": "50%",
      },
    },
  },
  corePlugins: {
    inset: true,
  },
};
