const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const { CleanWebpackPlugin } = require("clean-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")

module.exports = {
  entry: "./src/index.jsx",
  output: {
    filename: "bundle.js",
    path: path.resolve("dist"),
    publicPath: "/",
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.html$/,
        use: [{ loader: "html-loader" }],
      },
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: "less-loader",
            options: {
              lessOptions: {
                javascriptEnabled: true,
              },
            },
          },
        ],
      },
      {
        test: /\.(woff|woff2|ttf|eot|svg)($|\?)/,
        use: "url-loader",
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      favicon: "./public/favicon.ico",
      template: "./src/index.html",
      filename: "./index.html",
      hash: true,
    }),
    new MiniCssExtractPlugin(),
    new CleanWebpackPlugin(),
  ],
  resolve: {
    extensions: [".js", ".jsx"],
  },
  devServer: {
    host: "0.0.0.0",
    port: 3000,
    hot: true,
    historyApiFallback: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Request-Headers":
        "Access-Control-Allow-Origin, Access-Control-Allow-Headers, X-Requested-With, content-type, Authorization",
      "Access-Control-Allow-Headers":
        "Access-Control-Allow-Origin, Access-Control-Allow-Headers, Access-Control-Request-Headers, X-Requested-With, content-type, Authorization",
    },
  },
  devtool: "cheap-module-source-map",
}
