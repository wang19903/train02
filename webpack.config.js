const path = require("path");
const { VueLoaderPlugin } = require("vue-loader");

module.exports = {
  mode: "development",
  entry: "./src/index.js",
  output: {
    filename: "main.js",
    publicPath: "/dist/"
  },
  devServer: {
    static: path.join(__dirname, "public"), // 公共資源目錄
    compress: true, // 開啟 gzip 壓縮
    hot: true, // 開啟 HMR
    historyApiFallback: true,//找不到的路由 Vue Router 接管
    port: 8080 // 設定伺服器端口
  },
  module: {
    rules: [
      { test: /\.vue$/, use: "vue-loader" },
      { test: /\.css$/, use: ["vue-style-loader", "css-loader"] },
      {
        test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
        loader: "file-loader"
      },
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"]
          }
        }
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[hash].[ext]",
              outputPath: "fonts/", // where the fonts will go
              publicPath: "../" // override the default path
            }
          }
        ]
      },
      {
        test: /\.s(c|a)ss$/,
        use: [
          "vue-style-loader",
          "css-loader",
          {
            loader: "sass-loader",
            // Requires sass-loader@^7.0.0
            options: {
              implementation: require("sass"),
              indentedSyntax: true // optional
            },
            // Requires >= sass-loader@^8.0.0
            options: {
              implementation: require("sass"),
              sassOptions: {
                indentedSyntax: true // optional
              }
            }
          }
        ]
      }
    ]
  },
  resolve: {
    alias: {
      vue$: "vue/dist/vue.esm.js" // 對 Vue 進行別名設定
    }
  },
  plugins: [
    // 确保引入了此插件！
    new VueLoaderPlugin()
    // 其它插件...
  ]
};
