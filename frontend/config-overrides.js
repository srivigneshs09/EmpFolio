const webpack = require('webpack');

module.exports = function override(config) {
  config.resolve.fallback = {
    "crypto": require.resolve("crypto-browserify"),
    "util": require.resolve("util/"),
    "stream": require.resolve("stream-browserify")
  };
  return config;
};
