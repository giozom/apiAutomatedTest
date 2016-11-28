var assertions = require('../libs/assertions.js');

describe('assertions()', function () {

  describe('timestampCheck()', function () {

    it('should throw an error when an unrecognised "timezone" is supplied', function () {
      assert.throws(function () {
        assertions.timestampCheck('test', 'test', 'test', 'notAValidTimezone', 'test', 'test')
      }, Error, 'A valid timezone has not been specified - valid values are \'local-timezone\' and \'utc-timezone\'');
    });
  });
});
