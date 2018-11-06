const path = require("path");
const webpack = require("webpack");
const wpmerge = require("webpack-merge").smart;
const autoprefixer = require("autoprefixer");
const CleanPlugin = require("clean-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const HtmlPlugin = require("html-webpack-plugin");
const ExternalsPlugin = require("html-webpack-externals-plugin");
const MiniCssPlugin = require("mini-css-extract-plugin");

const { HOT, NODE_ENV, PORT = 8080, HOST = "localhost" } = process.env;
const DEV = NODE_ENV === "development";

module.exports = (root, config = {}) => {
  const {
    copyPluginOptions = [],
    externalsPluginOptions = [],
    htmlPluginOptions = {},
    ...options
  } = config;

  const defaults = {
    entry: "./index.js",
    devtool: DEV ? "inline-cheap-source-map" : undefined,
    context: path.join(root, "src"),
    module: {
      rules: [
        {
          test: /\.(png|jpg|gif)$/,
          use: [
            {
              loader: "file-loader",
              options: { emitFile: false, name: "[path][name].[ext]" }
            }
          ]
        },
        {
          test: /\.less$/,
          use: [
            DEV ? { loader: "style-loader" } : MiniCssPlugin.loader,
            {
              loader: "css-loader",
              options: {
                sourceMap: true,
                modules: true,
                importLoaders: true,
                localIdentName: "[name]-[local]"
              }
            },
            {
              loader: "postcss-loader",
              options: { plugins: () => [autoprefixer] }
            },
            { loader: "less-loader" }
          ]
        }
      ]
    },
    resolve: {
      modules: [path.resolve(root, "./src"), "node_modules"]
    },
    devServer: {
      compress: true,
      overlay: true,
      open: true,
      host: HOST,
      port: PORT,
      hot: HOT === "true",
      publicPath: `http://localhost:${PORT}/`,
      stats: { chunks: false, colors: true, reasons: false }
    }
  };

  defaults.plugins = [
    new CleanPlugin(["dist"], { root, verbose: true }),
    new HtmlPlugin({
      template: path.resolve(__dirname, "public/index.ejs"),
      stylesheets: ["base.css"],
      minify: {
        collapseWhitespace: true,
        removeComments: true,
        minifyJS: true,
        minifyCSS: true
      },
      ...htmlPluginOptions
    }),
    new MiniCssPlugin({ filename: "style.css" }),
    new CopyPlugin([
      { from: "*.css", to: "./", context: path.resolve(__dirname, "public") },
      ...copyPluginOptions
    ]),
    new ExternalsPlugin({
      cwpOptions: {
        context: path.resolve(root, "node_modules")
      },
      ...externalsPluginOptions
    })
  ];

  if (HOT) {
    defaults.plugins.push(new webpack.HotModuleReplacementPlugin());
  }

  return wpmerge(defaults, options);
};
