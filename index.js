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

    let enable = options.enable;
    if (enable === "undefined") {
        enable = true;
    }
    if (!enable) {
        return source;
    }

    // inject `module.hot.accept()` support js hmr
    let jsHotAccept = options.jsHotAccept || true;
    let js_hmr = jsHotAccept ? 'module.hot.accept();' + "\n" : '';

    if (jsHotAccept) {
        // just inject js `module.hot.accept()` support js hmr
        let onlyJS = options.onlyJS;
        if (onlyJS === "undefined") {
            onlyJS = false;
        }
        if (onlyJS) {
            return '' +
                source + "\n" +
                "\n" +
                'if (module.hot) {' +
                js_hmr +
                '}' + "\n";
        }
    }

    // The js relative root path relative project root path, like: client/js/
    let jsRootDir = options.jsRootDir;

    // The template relative root path relative project root path, like: client/view/
    let templateRootDir = options.templateRootDir;

    // Skip if the plugin configuration didn't set `jsRootDir` or `templateRootDir`
    if (!jsRootDir || !templateRootDir) {
        return source;
    }

    // js full path, like: D:\webpack_express\client\js\home\index.js
    const jsFullPath = this.resourcePath;
    const context = options.context || this.rootContext || (this.options && this.options.context);
    // The js relative path, like: client/js/home/
    let jsPath = loaderUtils.interpolateName(this, '[path]', {
        context
    });
    // The template name, like: index.hbs
    let name = loaderUtils.interpolateName(this, options.name, {
        context
    });
    // The js relative path 2, not equal jsPath, like: client\js\home\
    let jsPath2 = jsPath.replace(/\//g, '\\');

    // The js releative project path, like: ../../../
    let jsRelativeRoot = jsPath.replace(/.*?\//g, '..\/');

    // The project root path, like: D:\webpack_express\
    let projectRoot = jsFullPath.substr(0, jsFullPath.indexOf(jsPath2));


    // The template file name, relative project root path, like: client/view/home/index.hbs
    let templateFileName = templateRootDir + jsPath.replace(jsRootDir, '') + name;

    let nameFormat = options.nameFormat || undefined;
    if (nameFormat && typeof nameFormat === 'function') {
        templateFileName = nameFormat(templateFileName);
    }
    // The template file name relative the js, like: ../../../client/view/home/index.hbs
    let relativeTemplateFileName = jsRelativeRoot + templateFileName;

    // Determines whether the template file exists, if not, will not modify.
    if (!fs.existsSync(path.resolve(projectRoot, templateFileName))) {
        return source;
    }

    return '' +
        source + "\n" +
        "\n" +
        'if (module.hot) {' +
        'require("' + relativeTemplateFileName + '");' + "\n" +
        'module.hot.accept("' + relativeTemplateFileName + '", function() {' + "\n" +
        '   window.location.reload();' + "\n" +
        '});' + "\n" +
        js_hmr +
        '}' + "\n";
};