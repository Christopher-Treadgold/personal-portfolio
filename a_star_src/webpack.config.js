 var webpack = require("webpack");

module.exports = [
  {
    entry: ["babel-polyfill", "./a_star/index.js"],
    output: {
      path: "../pathfinding/src/",
      filename: "a-star.bundle.js"
    },
    plugins: [
      new webpack.optimize.UglifyJsPlugin({minimize: true})
    ],
    module: {
      loaders: [
        {
          test: /\.jsx?$/,
          exclude: /(node_modules|bower_components)/,
          loader: "babel-loader"
        }
      ]
    }
  }
];