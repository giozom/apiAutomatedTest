describe('jms - contains integer check', function () {

  var actualMsg = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
      <testRootElement xmlns="http://www.testing.com/integration/event">
        <containsElement>12345</containsElement>
      </testRootElement>`;

  it('should report a mismatch where an element\'s actual value does not contain the expected value', function () {
    var expectedMessage = [
      {path: 'testRootElement.containsElement', contains: 123456}
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
      actual: '12345',
      description: 'Check actual value 12345 contains 123456',
      expected: {contains: 123456},
      pass: false,
      target: {path: 'testRootElement.containsElement'}
    });
  });

  it('should report a match where the expected value is contained within the element\'s actual value', function () {
    var expectedMessage = [
      {path: 'testRootElement.containsElement', contains: 1234}
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
      actual: '12345',
      description: 'Check actual value 12345 contains 1234',
      expected: {contains: 1234},
      pass: true,
      target: {path: 'testRootElement.containsElement'}
    });
  });

  it('should report a match where the expected value is equal to the element\'s actual value', function () {
    var expectedMessage = [
      {path: 'testRootElement.containsElement', contains: 12345}
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
      actual: '12345',
      description: 'Check actual value 12345 contains 12345',
      expected: {contains: 12345},
      pass: true,
      target: {path: 'testRootElement.containsElement'}
    });
  });
});