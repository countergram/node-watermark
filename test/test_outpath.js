var assert = require("assert"),
    outpath = require("../lib/outpath");

describe('outpath', function() {
    describe('#inplace()', function() {
        it('should return its argument', function() {
            var value = "foo";
            assert.equal(value, outpath.inplace(value));
        })
    });
    describe('#outputDirectory()', function() {
        it('should return a function that joins the argument to a base path', function() {
            var basepath = "/root/path",
                arg = "foo",
                func = outpath.outputDirectory(basepath),
                result = func(arg);
            assert.equal(basepath + "/" + arg, result);
        })
    })
})
