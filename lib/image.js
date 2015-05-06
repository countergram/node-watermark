'use strict';

var gm = require('gm');

module.exports = {};

/**
 * Creates a function that will process a 'gm' object by resizing to fit within the
 * given width/height.
 * @param  {Number} width  Maximum image width. Optional.
 * @param  {Number} height Maximum image height. Optional.
 * @return {Function}        gm -> gm
 */
module.exports.makeResizeFunction = function(width, height) {
    // gm uses null inputs to denote not specifying a dimension
    // and preserving aspect based on the other one
    width = width || null;
    height = height || null;
    return function(gmImage) {
        // gm will error out if you pass (null, null)
        if(width !== null || height !== null) {
            return gmImage.resize(width, height);
        }
        return gmImage;
    }
}

/**
 * Creates a function that will composite an image onto a 'gm' object with
 * opacity and positioning.
 * @param  {String} filePath Filename of the image to be added (watermark)
 * @param  {Number} opacity  Opacity 1-100 to composite with
 * @param  {String} xpos     "left", "right", or nothing (center)
 * @param  {String} ypos     "top", "bottom", or nothing (center)
 * @return {Function}          gm -> gm
 */
module.exports.makeWatermarkFunction = function(filePath, opacity, xpos, ypos) {
    return function(gmImage) {
        gmImage = gmImage.composite(filePath)
            .dissolve(opacity);

        var direction = _getGmDirectionString(xpos, ypos);
        gmImage = gmImage.gravity(direction);
        if(direction != "Center") {
            // Margin so the watermark doesn't align right against the edge
            gmImage = gmImage.geometry("+10+10");
        }

        return gmImage;
    }
}

/**
 * Create an image containing the given text, sized to just fit that text. Calls
 * success() or logs an error.
 * @param  {String} filePath Output filename
 * @param  {String} text     Text to print in the image
 * @param  {String} color    Hex code, e.g. #ffffff, or color name used by Ghostscript
 * @param  {String} font     Name of a font to use
 * @param  {String} fontSize Point size to render font at
 * @param  {Function} success  callback for non-error completion
 */
module.exports.createWatermarkFile = function(filePath, text, color, font, fontSize, success) {
    // Create an image that is hopefully larger than the watermark, which will be trimmed
    // down to size. This is because of the lack of text dimension tools in GM.
    var largeWidth = 2000, largeHeight = 500;
    var gmImage = gm(largeWidth, largeHeight, "#000000").transparent("#000000");
    if(color) {
        gmImage = gmImage.fill(color);
    }
    if(font) {
        gmImage = gmImage.font(font);
    }
    if(fontSize) {
        gmImage = gmImage.fontSize(fontSize);
    }
    if(text) {
        // Text in gm is bottom aligned so this positioning is the simplest way
        // to fully include the text in the image.
        gmImage = gmImage.drawText(0, largeHeight, text);
    }
    gmImage = gmImage.trim();
    gmImage.write(filePath, function(err) {
        if(err) {
            console.log(err.trim());
        } else {
            success(filePath);
        }
    })
}


var DIRECTIONS = {
    "left": "West",
    "right": "East",
    "top": "North",
    "bottom": "South",
    "center": ""
}

/**
 * Translate between the options we expect and those that GraphicsMagick uses.
 * @param  {String} optionValue left, right, top, bottom, or another value
 * @return {String}             (Partial) gravity value for 'gm', or empty string if input not recognized
 */
function getDirection(optionValue) {
    if(optionValue) {
        optionValue = optionValue.toLowerCase();
        if(DIRECTIONS.hasOwnProperty(optionValue)) {
            return DIRECTIONS[optionValue];
        }
    }
    return "";
}

/**
 * Translate English options for x and y position into a full 'gm' gravity specifier.
 * @param  {String} xpos left, right, or nothing
 * @param  {String} ypos top, bottom, or nothing
 * @return {String}      'gm' gravity specifier such as SouthWest, North, Center, etc.
 */
var _getGmDirectionString = module.exports._getGmDirectionString = function (xpos, ypos) {
    var direction = getDirection(ypos) + getDirection(xpos);
    return direction || "Center";
}

