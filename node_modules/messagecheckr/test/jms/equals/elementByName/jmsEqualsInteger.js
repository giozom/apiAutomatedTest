describe('jms - integer value check', function () {

  var actualMsg = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
  <testRootElement xmlns="http://www.testing.com/integration/event">
    <integerFieldWith1Digit>1</integerFieldWith1Digit>
    <integerFieldWithMoreThan1Digit>12345</integerFieldWithMoreThan1Digit>
    <alphabeticalValue>abc</alphabeticalValue>
  </testRootElement>`;

  it('should report a mismatch where actual integer value does not the expected integer value', function () {
    var expectedMessage = [
      {path: 'testRootElement.integerFieldWith1Digit', equals: 2}
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
      actual: 1,
      description: "Check actual value 1 is equal to 2",
      expected: {equals: 2},
      pass: false,
      target: {path: 'testRootElement.integerFieldWith1Digit'}
    });
  });

  it('should report a mismatch where actual value is not an integer', function () {
    var expectedMessage = [
      {path: 'testRootElement.alphabeticalValue', equals: 1}
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
      actual: NaN,
      description: "Check actual value abc is equal to 1",
      expected: {equals: 1},
      pass: false,
      target: {path: 'testRootElement.alphabeticalValue'}
    });
  });

  it('should report a match where the actual integer value matches the expected integer value - single digit', function () {
    var expectedMessage = [
      {path: 'testRootElement.integerFieldWith1Digit', equals: 1}
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
      actual: 1,
      description: "Check actual value 1 is equal to 1",
      expected: {equals: 1},
      pass: true,
      target: {path: 'testRootElement.integerFieldWith1Digit'}
    });
  });

  it('should report a match where the actual integer value matches the expected integer value - more than single digit', function () {
    var expectedMessage = [
      {path: 'testRootElement.integerFieldWithMoreThan1Digit', equals: 12345}
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
      actual: 12345,
      description: "Check actual value 12345 is equal to 12345",
      expected: {equals: 12345},
      pass: true,
      target: {path: 'testRootElement.integerFieldWithMoreThan1Digit'}
    });
  });
});