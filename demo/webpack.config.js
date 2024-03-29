const path = require('path');

module.exports = {
  entry: "./public/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "index.js",
  },
  mode: "development",
  experiments: {
    asyncWebAssembly: true,
    syncWebAssembly: true
  },
};