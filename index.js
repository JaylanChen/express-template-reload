'use strict';
// loader-utils可以解析webpack配置文件中loader传入的参数
const loaderUtils = require('loader-utils');
const fs = require('fs')
const path = require('path');


module.exports = function (source, map) {
    if (this.cacheable) {
        this.cacheable();
    }
    // Loader Options
    const options = loaderUtils.getOptions(this) || {};
    const context = options.context || this.rootContext || (this.options && this.options.context);

    let name = loaderUtils.interpolateName(this, options.name, {
        context
    });
    
    let enable = options.enable;
    if(enable === "undefined"){
        enable =true;
    }

    if (!enable) {
        return source;
    }

    let basePath = options.publicPath;
    let nameFormat = options.nameFormat || undefined;
    let jsHotAccept = options.jsHotAccept || true;
    let viewsSourcePath = options.viewsSourcePath;

    if (nameFormat && typeof nameFormat === 'function') {
        name = nameFormat(name);
    }
    var js_hmr = jsHotAccept ? 'module.hot.accept();' + "\n" : '';

    var templateFileName = basePath + name;

    if(!fs.existsSync(viewsSourcePath + name)){
        return source;
    }

    return '' +
    source + "\n" +
    "\n" +
    'if (module.hot) {' +
    'require("' + templateFileName + '");' + "\n" +
    'module.hot.accept("' + templateFileName + '", function() {' + "\n" +
    '   window.location.reload();' + "\n" +
    '});' + "\n" +
    js_hmr +
    '}' + "\n";
};