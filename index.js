const fs = require("fs");
const path = require("path");
const webpack = require("webpack");
const wpmerge = require("webpack-merge").smart;
const CleanPlugin = require("clean-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const HtmlPlugin = require("html-webpack-plugin");
const ExternalsPlugin = require("html-webpack-externals-plugin");

const { HOT, NODE_ENV, PORT = 8080, HOST = "localhost" } = process.env;
const NODE_MODULES = path.resolve(__dirname, "..");
const DEV = NODE_ENV === "development";
const plugins = [];

for (let i = 0, files = fs.readdirSync(NODE_MODULES); files[i]; i++) {
  if (files[i].match(/^wprun-config-(\w+[-]?)+/g)) {
    plugins.push(require(path.resolve(NODE_MODULES, files[i])));
  }
}

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
    resolve: {
      modules: [path.resolve(root, "./src"), "node_modules"],
    },
    plugins: [
      new CleanPlugin(["dist"], { root, verbose: true }),
      new HtmlPlugin({
        template: path.resolve(__dirname, "public/index.ejs"),
        minify: {
          collapseWhitespace: true,
          removeComments: true,
          minifyJS: true,
          minifyCSS: true,
        },
        ...htmlPluginOptions,
      }),
      new CopyPlugin([
        { from: "*.css", to: "./", context: path.resolve(__dirname, "public") },
        ...copyPluginOptions,
      ]),
      new ExternalsPlugin({
        cwpOptions: { context: path.resolve(root, "node_modules") },
        ...externalsPluginOptions,
      }),
    ],
    devServer: {
      compress: true,
      overlay: true,
      open: true,
      host: HOST,
      port: PORT,
      hot: HOT === "true",
      publicPath: `http://localhost:${PORT}/`,
      stats: { chunks: false, colors: true, reasons: false },
    },
  };

  if (HOT === "true") {
    defaults.plugins.push(new webpack.HotModuleReplacementPlugin());
  }

  return plugins.concat(options).reduce((obj, cfg = {}) => wpmerge(obj, cfg), defaults);
};
