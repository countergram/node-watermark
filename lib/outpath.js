'use strict';

var path = require('path');

module.exports = {};

module.exports.inplace = function(filePath) {
    return filePath;
}

module.exports.outputDirectory = function(dirPath) {
    return function(filePath) {
        return path.join(dirPath, path.basename(filePath));
    }
}
