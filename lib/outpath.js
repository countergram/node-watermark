'use strict';

var path = require('path');

module.exports = {};

/**
 * Identity function indicating a file will be written out to the same path
 * @param  {String} filePath Path of input/output file
 * @return {String}
 */
module.exports.inplace = function(filePath) {
    return filePath;
}

/**
 * Create a function that makes a path with an input filename and a base directory.
 * @param  {String} dirPath Base directory
 * @return {Function}         String -> String
 */
module.exports.outputDirectory = function(dirPath) {
    return function(filePath) {
        return path.join(dirPath, path.basename(filePath));
    }
}
