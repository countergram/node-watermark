var assert = require('assert'),
    image = require('../lib/image');

describe('image', function() {
    describe('#_getGmDirectionString()', function() {
        it('should translate and concatenate xpos and ypos', function() {
            assert.equal('SouthWest', image._getGmDirectionString('left', 'bottom'));
            assert.equal('NorthEast', image._getGmDirectionString('right', 'top'));
        });
        it('should accept only xpos', function() {
            assert.equal('South', image._getGmDirectionString(undefined, 'bottom'));
        });
        it('should default to Center', function() {
            assert.equal('Center', image._getGmDirectionString());
        })
    })
})
