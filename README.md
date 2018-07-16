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
|**[`publicPath`](#)**|`{String}`|``|The path of the template relative to js|
|**[`name`](#)**|`{String}`||The template name, suce as `/[folder]/[name].hbs`|
|**[`viewsSourcePath`](#)**|`{String}`||The templates root path, `viewsSourcePath` + `name` will used to determine if a template exists, if it does not exist, will not modify it|
|**[`nameFormat`](#)**|`{Function}`||Allows format template name base on the JS file name|
|**[`jsHotAccept`](#)**|`{Boolean}`|`true`|If `true` adds 'module.hot.accept()' to the bottom of modules allows js `hot module replace`|

## Why use `viewsSourcePath` + `name`, `publicPath`

1.`viewsSourcePath` + `name`
In a multiple-page web application, a webpack entry file should have a template, so use ' viewssourcepath ' + ' name ' to determine whether the current file is a entry file.
If you have a better way to judge the current JS is not a webpack entry file, please tell me as soon as possible, thank you.

2.`publicPath`
JS and templates may not be in one folder, but there should be a rule between them and to relate them.

## For example

File directory structure

--client
----js
------home
--------index.js
...
----view
------home
--------index.hbs
...

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
    require('../../views/home/index.hbs')
    module.hot.accept('../../views/home/index.hbs', function () {
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
            publicPath: '../relative/view/source/path',
            name: '/[folder]/[name].hbs',
            viewsSourcePath: 'absolute/view/source/path',//Determine if the template exists to inject hmr
            //nameFormat: name => name.substr(name.indexOf('js/') + 2, name.length),
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
