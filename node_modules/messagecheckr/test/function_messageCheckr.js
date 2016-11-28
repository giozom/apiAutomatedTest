var messageCheckr = require('../messageCheckr.js');

describe('messageCheckr()', function () {

  it('should throw an error where actual message is not a string and type is "position"', function () {
    assert.throws(function () {
        messageCheckr({
          actualMsg: {},
          expectedMsg: [{
            begin: 0, end: 1, equals: 'test'
          }],
          type: 'position'
        })
      }, Error, 'actualMsg should be a string when type is "position"'
    );
  });
});