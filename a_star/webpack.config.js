 module.exports = {
     entry: ["babel-polyfill", "./index.js"],
     output: {
         path: "./packed",
         filename: "a-star.bundle.js"
     },
     module: {
      loaders: [
        {
          test: /\.jsx?$/,
          exclude: /(node_modules|bower_components)/,
          loader: "babel-loader"
        }
      ]
     }
 };