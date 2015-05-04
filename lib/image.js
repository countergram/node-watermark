'use strict';

var gm = require('gm');

module.exports = {};

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

// Translate between the options we expect and those that GraphicsMagick uses
var DIRECTIONS = {
    "left": "West",
    "right": "East",
    "top": "North",
    "bottom": "South",
    "center": ""
}

function getDirection(optionValue) {
    if(optionValue) {
        optionValue = optionValue.toLowerCase();
        if(DIRECTIONS.hasOwnProperty(optionValue)) {
            return DIRECTIONS[optionValue];
        }
    }
    return "";
}

module.exports._getGmDirectionString = function(xpos, ypos) {
    var direction = getDirection(ypos) + getDirection(xpos);
    return direction || "Center";
}

