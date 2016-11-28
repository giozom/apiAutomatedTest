describe('jms - is integer check', function () {

  var actualMsg = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
  <testRootElement xmlns="http://www.testing.com/integration/event">
    <integerFieldWith1Digit>1</integerFieldWith1Digit>
    <integerFieldWith1DigitAndOnlyZeroAfterDecimalPlace>1.0</integerFieldWith1DigitAndOnlyZeroAfterDecimalPlace>
    <integerFieldWithMoreThan1Digit>12345</integerFieldWithMoreThan1Digit>
    <integerFieldWithMinusValue>-1</integerFieldWithMinusValue>
    <alphabeticalValue>abc</alphabeticalValue>
    <floatValue>1.1</floatValue>
  </testRootElement>`;

  it('should report a mismatch where the actual value is not an integer - it is alphabetical', function () {
    var expectedMessage = [
      {path: 'testRootElement.alphabeticalValue', equals: '{integer}'}
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
      actual: "abc",
      expected: "{integer}",
      target: {path: 'testRootElement.alphabeticalValue'},
      description: "Check actual value abc is an integer",
      pass: false
    });
  });

  it('should report a mismatch where the actual value is not an integer - it is a decimal/float', function () {
    var expectedMessage = [
      {path: 'testRootElement.floatValue', equals: '{integer}'}
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
      actual: "1.1",
      expected: "{integer}",
      target: {path: 'testRootElement.floatValue'},
      description: "Check actual value 1.1 is an integer",
      pass: false
    });
  });

  it('should report a match where the actual value is an integer (1)', function () {
    var expectedMessage = [
      {path: 'testRootElement.integerFieldWith1Digit', equals: '{integer}'}
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
      actual: "1",
      expected: "{integer}",
      target: {path: 'testRootElement.integerFieldWith1Digit'},
      description: "Check actual value 1 is an integer",
      pass: true
    });
  });

  it('should report a match where the actual value is an integer (1.0)', function () {
    var expectedMessage = [
      {path: 'testRootElement.integerFieldWith1DigitAndOnlyZeroAfterDecimalPlace', equals: '{integer}'}
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
      actual: "1.0",
      expected: "{integer}",
      target: {path: 'testRootElement.integerFieldWith1DigitAndOnlyZeroAfterDecimalPlace'},
      description: "Check actual value 1.0 is an integer",
      pass: true
    });
  });

  it('should report a match where the actual value is an integer (12345)', function () {
    var expectedMessage = [
      {path: 'testRootElement.integerFieldWithMoreThan1Digit', equals: '{integer}'}
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
      actual: "12345",
      expected: "{integer}",
      target: {path: 'testRootElement.integerFieldWithMoreThan1Digit'},
      description: "Check actual value 12345 is an integer",
      pass: true
    });
  });

  it('should report a match where the actual value is a negative integer (-1)', function () {
    var expectedMessage = [
      {path: 'testRootElement.integerFieldWithMinusValue', equals: '{integer}'}
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
      actual: "-1",
      expected: "{integer}",
      target: {path: 'testRootElement.integerFieldWithMinusValue'},
      description: "Check actual value -1 is an integer",
      pass: true
    });
  });
});