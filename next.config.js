const withPWA = require("next-pwa");

module.exports = withPWA({
  target: "experimental-serverless-trace",
  pwa: {
    disable: process.env.NODE_ENV === "development",
    dest: "public",
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.node = { fs: "empty" };
    }

    config.module.rules.push({
      test: /react-spring/,
      sideEffects: true,
    });
    return config;
  },
  // future: { webpack5: true },
});
