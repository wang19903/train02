const path = require('path');
const { VueLoaderPlugin } = require('vue-loader')


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
    port: 8080 // 設定伺服器端口
  },
  module: {
    rules: [
      { test: /\.vue$/, use: "vue-loader" },
      { test: /\.css$/, use: ["vue-style-loader", "css-loader"] },
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"]
          }
        }
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
    new VueLoaderPlugin(),
    // 其它插件...
  ],
};
