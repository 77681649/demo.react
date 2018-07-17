const path = require("path");
const webpack = require("webpack");
// const WebpackDevServer = require("webpack-dev-server");

const wrapHotSeedFile = path => {
  return [
    "webpack-dev-server/client?http://0.0.0.0:3000",
    "webpack/hot/only-dev-server",
    path
  ];
};

module.exports = {
  mode: "development",
  // entry: path.join(__dirname, "src", "index"),
  // HRM entry
  // entry: wrapHotSeedFile("./src/index"),
  entry: "./client",
  output: {
    path: path.resolve(__dirname, "public", "js"),
    filename: "[name].bundle.js",
    chunkFilename: "[name].bundle.js",
    publicPath: "/js/"
  },
  module: {
    rules: [
      {
        test: /.jsx?$/,
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
            require.resolve("babel-plugin-transform-object-rest-spread")
            // 热替换插件
            // require.resolve("react-hot-loader/babel")
          ]
        }
      }
    ]
  },
  resolve: {
    extensions: [".json", ".js", ".jsx", ".css"]
  },
  devtool: "source-map",
  optimization: {
    splitChunks: {
      chunks: "all"
    }
  },
  plugins: [
    // start HMR
    // new webpack.HotModuleReplacementPlugin(),

    // 当模块热替换(HMR)时在浏览器控制台输出对用户更友好的模块名字信息
    new webpack.NamedModulesPlugin(),

    new webpack.NoEmitOnErrorsPlugin(),

    // new HtmlWebpackPlugin({
    //   template: path.join(__dirname, "public/index.html"),
    //   favicon: path.join(__dirname, "public/favicon.ico")
    // })

    new webpack.DefinePlugin({
      ONCLIENT: "true"
    })
  ]
};
