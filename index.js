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

const styleLoaders = [
  DEV ? { loader: "style-loader" } : MiniCssExtractPlugin.loader,
  {
    loader: "css-loader",
    options: {
      camelCase: true,
      sourceMap: true,
      modules: true,
      importLoaders: true,
      localIdentName: "[name]__[local]__[hash:base64:10]",
    },
  },
  {
    loader: "postcss-loader",
    options: { plugins: () => [autoprefixer] },
  },
];

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
          test: /\.eot(\?v=\d+.\d+.\d+)?$/,
          loader: "file-loader",
        },
        {
          test: /\.woff2?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          loader: "url-loader?limit=10000&mimetype=application/font-woff",
        },
        {
          test: /\.[ot]tf(\?v=\d+.\d+.\d+)?$/,
          loader: "url-loader?limit=10000&mimetype=application/octet-stream",
        },
        {
          test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
          loader: "url-loader?limit=10000&mimetype=image/svg+xml",
        },
        {
          test: /\.(ico|jpe?g|png|gif)$/i,
          loader: "file-loader?name=[name].[ext]",
        },
        {
          test: /\.css$/,
          use: [DEV ? "style-loader" : MiniCssPlugin.loader, "css-loader"],
        },
        {
          test: /\.less$/,
          use: [...styleLoaders, { loader: "less-loader" }],
        },
        {
          test: /\.s[ac]ss$/,
          use: [...styleLoaders, { loader: "sass-loader" }],
        },
      ],
    },
    resolve: {
      modules: [path.resolve(root, "./src"), "node_modules"],
    },
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

  defaults.plugins = [
    new CleanPlugin(["dist"], { root, verbose: true }),
    new HtmlPlugin({
      template: path.resolve(__dirname, "public/index.ejs"),
      stylesheets: ["base.css"],
      minify: {
        collapseWhitespace: true,
        removeComments: true,
        minifyJS: true,
        minifyCSS: true,
      },
      ...htmlPluginOptions,
    }),
    new MiniCssPlugin({ filename: "style.css" }),
    new CopyPlugin([
      { from: "*.css", to: "./", context: path.resolve(__dirname, "public") },
      ...copyPluginOptions,
    ]),
    new ExternalsPlugin({
      cwpOptions: { context: path.resolve(root, "node_modules") },
      ...externalsPluginOptions,
    }),
  ];

  if (HOT) {
    defaults.plugins.push(new webpack.HotModuleReplacementPlugin());
  }

  return wpmerge(defaults, options);
};
