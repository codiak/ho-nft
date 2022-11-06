const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: {
    content: "./src/content-scripts/nftplatforms.js",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-react"],
          },
        }
      },
      {
        test: /\.css$/,
        use: ["css-loader"],
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: "manifest.json", to: path.join(__dirname, "dist") },
        { from: "src/css/antd.min.css",
          to: path.join(__dirname, "dist"),
          force: true 
        },
        {
          from: "src/icons/icon-128.png",
          to: path.join(__dirname, "dist"),
        },
        {
          from: "src/icons/icon-48.png",
          to: path.join(__dirname, "dist"),
        },
        {
          from: "src/icons/icon-34.png",
          to: path.join(__dirname, "dist"),
        },
        {
          from: "src/icons/icon-256.png",
          to: path.join(__dirname, "dist"),
        },
      ],
    }),
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
    }),
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer']
    }),
  ],
  resolve: {
    // polyfills
    fallback: {
      "stream": require.resolve("stream-browserify"),
      "http": require.resolve("stream-http"),
      "https": require.resolve("https-browserify"),
      "os": require.resolve("os-browserify/browser")
    }
  }
};
