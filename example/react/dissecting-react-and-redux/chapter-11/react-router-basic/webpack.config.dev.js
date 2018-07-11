const path = require("path");
const webpack = require("webpack");
const WebpackDevServer = require("webpack-dev-server");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const wrapHotSeedFile = path => {
  return [
    "webpack-dev-server/client?http://0.0.0.0:3000",
    "webpack/hot/only-dev-server",
    path
  ];
};

const webpackConfig = {
  mode: "development",
  // entry: path.join(__dirname, "src", "index"),
  // HRM entry
  entry: wrapHotSeedFile("./src/index"),
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].bundle.js",
    chunkFilename: "[name].bundle.js"
  },
  module: {
    rules: [
      {
        test: /.jsx?$/,
        include: [path.resolve(__dirname, "src")],
        exclude: [
          path.resolve(__dirname, "node_modules"),
          path.resolve(__dirname, "bower_components")
        ],
        loader: "babel-loader",
        options: {
          babelrc: false,
          cacheDirectory: true,
          presets: [
            require.resolve("babel-preset-env"),
            require.resolve("babel-preset-react")
          ],
          plugins: [
            require.resolve("babel-plugin-transform-object-rest-spread"),
            require.resolve("babel-plugin-syntax-dynamic-import"),
            // 热替换插件
            require.resolve("react-hot-loader/babel")
          ]
        }
      }
    ]
  },
  resolve: {
    extensions: [".json", ".js", ".jsx", ".css"]
  },
  devtool: "source-map",
  watch: true,
  optimization: {
    splitChunks: {
      chunks: "all"
    }
  },
  plugins: [
    // start HMR
    new webpack.HotModuleReplacementPlugin(),

    // 当模块热替换(HMR)时在浏览器控制台输出对用户更友好的模块名字信息
    new webpack.NamedModulesPlugin(),

    new webpack.NoEmitOnErrorsPlugin(),

    new HtmlWebpackPlugin({
      template: path.join(__dirname, "public/index.html"),
      favicon: path.join(__dirname, "public/favicon.ico")
    })
  ]
};

const webpackServerConfig = {
  contentBase: path.join(__dirname, "dist"),
  publicPath: "/",
  compress: true,
  hot: true,
  headers: {
    "Access-Control-Allow-Origin": "*"
  }
};

const compiler = webpack(webpackConfig);
const devServer = new WebpackDevServer(compiler, webpackServerConfig);
const port = process.env.PORT || 3000;

devServer.listen(port, function() {
  console.log("dev-server started.");
});
