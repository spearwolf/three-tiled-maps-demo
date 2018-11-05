// tslint:disable:object-literal-sort-keys
const path = require("path");

module.exports = {
  entry: "./src/main.js",
  mode: "development",
  devtool: "inline-source-map",
  devServer: {
    contentBase: [
      "./public",
      "./assets/exports",
    ],
    host: "0.0.0.0",
    useLocalIp: true,
    disableHostCheck: true,
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
            plugins: ["@babel/plugin-transform-runtime"],
          },
        },
      },
    ],
  },
  resolve: {
    extensions: [ ".ts", ".js" ],
  },
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "public"),
  },
};
