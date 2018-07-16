# express-template-reload
Tiny webpack plugin that make express template(like handlebars) support reload page when changed.

This loader is automatically added to this code to support reload page when template changed.

## Installation
```
npm install --save-dev express-template-reload
```

PS: The temeplate should use loader too, such as `raw-loader`,`html-loader` and so on.


## Options

You can pass a hash of configuration options to `express-template-reload`.
Allowed values are as follows

|Name|Type|Default|Description|
|:--:|:--:|:-----:|:----------|
|**[`enable`](#)**|`{Boolean}`|`true`|Enable this loader or disable, production should disable|
|**[`name`](#)**|`{String}`||The template name, like: index.hbs|
|**[`jsRootDir`](#)**|`{String}`||The js relative root path relative project root path, like: client/js/|
|**[`templateRootDir`](#)**|`{String}`||The template relative root path relative project root path, like: client/view/|
|**[`nameFormat`](#)**|`{Function}`||Allows format template name base on the JS file name|
|**[`jsHotAccept`](#)**|`{Boolean}`|`true`|If `true` adds 'module.hot.accept()' to the bottom of modules allows js `hot module replace`|

## Why use `jsRootDir`, `templateRootDir`

In a multiple-page web application, a webpack entry file should have a template, so use them to calculate the path of the template relative to js. And determines whether the template file exists, if not, the current file is a not entry file, also nothing will not modify.

If you have a better way to judge the current JS is not a webpack entry file, please tell me as soon as possible, thank you.

## For example

File directory structure

```js
--client
----js
------home
--------index.js
...
----view
------home
--------index.hbs
...
```

As we konw if you want to support JS hmr, you should add this

```js
// home/index.js
if (module.hot) {
    //js hmr
    module.hot.accept();
}
```
If you want to support reload page when template changed.

```js
// client/js/home/index.js
if (module.hot) {
    // template reload
    require('../../../client/view/home/index.hbs')
    module.hot.accept('../../../client/view/home/index.hbs', function () {
        window.location.reload();
    })
    //js hmr
    module.hot.accept();
}
```


This loader is automatically added to this code to support reload page when template changed.


## Usage
```js
// webpack.config.js

var webpack = require('webpack');

module.exports = {
  entry: [
    'webpack-hot-middleware/client?reload=true',
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
            name: '[name].hbs',
            jsRootDir: 'client/js/',
            templateRootDir: 'client/views/',
            //nameFormat: name => name.substr(name.indexOf('views/') + 6, name.length),
            jsHotAccept: true
          }
        }],
      },
      {
        test: /\.hbs$/,
        use: {
          loader: 'raw-loader'
        },
        exclude: /node_modules/,
      }
    ]
  }
};

```
