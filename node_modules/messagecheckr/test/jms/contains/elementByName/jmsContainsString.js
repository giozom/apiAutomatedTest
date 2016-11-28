describe('jms - contains string check', function () {

  var actualMsg = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
      <testRootElement xmlns="http://www.testing.com/integration/event">
        <containsElement>noisehellonoise</containsElement>
      </testRootElement>`;

  it('should report a mismatch where an element\'s actual value does not contain the expected value', function () {
    var expectedMessage = [
      {path: 'testRootElement.containsElement', contains: 'yello'}
    ];

    var result = messageCheckr({
      type: 'jms',
      verbose: true,
      actualMsg: actualMsg,
      expectedMsg: expectedMessage,
      expectedRootElement: 'testRootElement'
    });

    assert.equal(result.allChecksPassed, false);
    assert.deepEqual(result.checks[1], {
      actual: 'noisehellonoise',
      description: 'Check actual value noisehellonoise contains yello',
      expected: {contains: 'yello'},
      pass: false,
      target: {path: 'testRootElement.containsElement'}
    });
  });

  it('should report a match where the expected value is contained within the element\'s actual value', function () {
    var expectedMessage = [
      {path: 'testRootElement.containsElement', contains: 'hello'}
    ];

    var result = messageCheckr({
      type: 'jms',
      verbose: true,
      actualMsg: actualMsg,
      expectedMsg: expectedMessage,
      expectedRootElement: 'testRootElement'
    });

    assert.equal(result.allChecksPassed, true);
    assert.deepEqual(result.checks[1], {
      actual: 'noisehellonoise',
      description: 'Check actual value noisehellonoise contains hello',
      expected: {contains: 'hello'},
      pass: true,
      target: {path: 'testRootElement.containsElement'}
    });
  });

  it('should report a match where the expected value is equal to the element\'s actual value', function () {
    var expectedMessage = [
      {path: 'testRootElement.containsElement', contains: 'noisehellonoise'}
    ];

    var result = messageCheckr({
      type: 'jms',
      verbose: true,
      actualMsg: actualMsg,
      expectedMsg: expectedMessage,
      expectedRootElement: 'testRootElement'
    });

    assert.equal(result.allChecksPassed, true);
    assert.deepEqual(result.checks[1], {
      actual: 'noisehellonoise',
      description: 'Check actual value noisehellonoise contains noisehellonoise',
      expected: {contains: 'noisehellonoise'},
      pass: true,
      target: {path: 'testRootElement.containsElement'}
    });
  });
});