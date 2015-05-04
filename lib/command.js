'use strict';

var pkg = require('../package.json'),
    image = require('./image'),
    outpath = require('./outpath'),
    gm = require('gm'),
    mkdirp = require('mkdirp'),
    tmp = require('tmp');

// TODO: argument validation with val()
module.exports = require('coa').Cmd()
    .name(process.argv[1])
    .helpful()
    .opt()
        .name('version').title('Version')
        .short('v').long('version')
        .only().flag()
        .act(function() {
            return pkg.version;
        })
        .end()
    .opt()
        .name('width').title('Maximum width')
        .short('w').long('width')
        .end()
    .opt()
        .name('height').title('Maximum height')
        .short('h').long('height')
        .end()
    .opt()
        .name('out').title('Output directory')
        .short('o').long('out')
        .end()
    .opt()
        .name('inplace').title('Change files in place')
        .long('inplace')
        .flag()
        .end()
    .opt()
        .name('text').title('Text for watermark')
        .short('t').long('text')
        .end()
    .opt()
        .name('font').title('Font (default: Helvetica)')
        .long('font')
        .def('Helvetica')
        .end()
    .opt()
        .name('size').title('Font size')
        .long('size')
        .def(12)
        .end()
    .opt()
        .name('color').title('Text color name or RGB hex code')
        .long('color')
        .def('rgb(255, 255, 255)')
        .end()
    .opt()
        .name('opacity').title('Opacity (0-100, default 35)')
        .short('a').long('opacity')
        .def(35)
        .end()
    .opt()
        .name('xpos').title('left, right, or center text (default center)')
        .short('x').long('xpos')
        .def('center')
        .end()
    .opt()
        .name('ypos').title('top, bottom, or center text (default center)')
        .short('y').long('ypos')
        .def('center')
        .end()
    .arg()
        .name('paths').title('File(s) to process')
        .arr()
        .end()
    // Process the command if it was not done by another act() earlier.
    .act(function(opts, args) {
        if(Object.getOwnPropertyNames(opts).length == 0) {
            return this.usage();
        }

        // Could use .req() above but it would override the check on empty opts
        if(!args.hasOwnProperty('paths') || args['paths'].length == 0) {
            return this.usage();
        }

        var paths = args['paths'];

        // Choose a function to generate output paths based on input paths.
        var makeOutputPath = null;
        if(opts.inplace) {
            makeOutputPath = outpath.inplace;
        } else if(opts.out) {
            makeOutputPath = outpath.outputDirectory(opts.out);
            // Create the output directory if it does not exist
            // TODO: make sure we will output something before creating directory
            mkdirp(opts.out, function(err) {
                if(err) {
                    console.error(err);
                    return;
                }
            });
        }

        // TODO: should also error if both options are given
        if(makeOutputPath === null) {
            console.error("You must specify either --inplace or --out");
            return;
        }

        // Since GM is very file-based we need a temp file for the actual watermark
        tmp.setGracefulCleanup();
        var tempFilePath = tmp.tmpNameSync({'postfix': '.png'});
        image.createWatermarkFile(tempFilePath, opts.text, opts.color, opts.font, opts.size, function() {
            var doResize = image.makeResizeFunction(opts.width, opts.height);
            var doWatermark = image.makeWatermarkFunction(tempFilePath, opts.opacity, opts.xpos, opts.ypos);

            // Loop through and process file paths
            for(var i = 0; i < paths.length; i++) {
                var filePath = paths[i];
                var gmImage = gm(filePath);
                gmImage = doResize(gmImage);
                gmImage = doWatermark(gmImage);
                gmImage.write(makeOutputPath(filePath), function(err) {
                    if(err) {
                        console.error(err.message.trim());
                    }
                });
            }
        });
    });
