const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const Dotenv = require("dotenv-webpack");

module.exports = {
  entry: "./src/index.ts",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
  },
  resolve: {
    extensions: [".js", ".ts", ".json", ".wasm"],
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: "head",
      template: "./src/index.html",
      filename: "index.html",
    }),
    new webpack.EnvironmentPlugin({
      NODE_ENV: "production",
      DEBUG: false,
    }),
    new MiniCssExtractPlugin(),
    new Dotenv({
      systemvars: true,
      safe: true,
    }),
  ],
  devServer: {
    contentBase: "./dist",
    https: false,
    host: "localhost",
    port: 5050,
    disableHostCheck: true,
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        exclude: /(node_modules)/,
        use: ["babel-loader"],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          // Translates CSS into CommonJS
          {
            loader: "css-loader",
            options: {
              url: false,
            },
          },
          // Compiles Sass to CSS
          "sass-loader",
        ],
      },
      {
        test: /zcv\.wasm$/,
        type: "javascript/auto",
        loader: "file-loader",
      },
      {
        test: /\.html$/,
        use: {
          loader: "html-loader",
          options: {
            attributes: {
              list: [
                { tag: "img", attribute: "src", type: "src" },
                { tag: "a-asset-item", attribute: "src", type: "src" },
              ],
            },
          },
        },
      },
      {
        test: /\.(jpe?g|png|mp3|wav|zpt)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[path][name].[ext]?[hash:7]",
              context: "src",
            },
          },
        ],
      },
    ],
  },
};
