# express-template-reload
Tiny webpack plugin that make express template(like handlebars) support reload page when changed.

## Installation
```
npm install --save-dev express-template-reload
```

## Usage
```js
// webpack.config.js

var webpack = require('webpack');

module.exports = {
  entry: [
    'webpack/hot/only-dev-server',
    './entry.js'
  ],
  output: {
    filename: 'bundle.js'
  },
  plugins: [
    new webpack.NoErrorsPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use:[{
          loader: 'babel-loader',
        },{
          loader: 'express-template-reload',
          options: {
            enable: process.env.NODE_ENV === 'local', //default true
            publicPath: '../relative/view/source/path',
            name: '/[folder]/[name].hbs',
            viewsSourcePath: 'absolute/view/source/path',//Determine if the template exists to inject hmr
            //nameFormat: name => name.substr(name.indexOf('js/') + 2, name.length),
            jsHotAccept: true
          }
        }],
      }
    ]
  }
};

```
