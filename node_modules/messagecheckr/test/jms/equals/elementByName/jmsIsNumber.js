describe('jms - is number check', function () {

  var actualMsg = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
  <testRootElement xmlns="http://www.testing.com/integration/event">
    <notANumber>abc</notANumber>
    <numberWithoutDecimalPlaces>1</numberWithoutDecimalPlaces>
    <numberWith1DecimalPlace>1.0</numberWith1DecimalPlace>
    <numberWith2DecimalPlaces>100.10</numberWith2DecimalPlaces>
    <numberWithNoNumberBeforePeriod>.12</numberWithNoNumberBeforePeriod>
  </testRootElement>`;

  it('should report a mismatch where the actual value is not an number - it is alphabetical', function () {
    var expectedMessage = [
      {path: 'testRootElement.notANumber', equals: '{number(1)}'}
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
      expected: "{number(1)}",
      target: {path: 'testRootElement.notANumber'},
      description: "Check actual value abc is a number with 1 decimal places",
      pass: false
    });
  });

  it('should report a mismatch where the actual value is a number but the number of decimal places do not match the expected (no decimal places)', function () {
    var expectedMessage = [
      {path: 'testRootElement.numberWithoutDecimalPlaces', equals: '{number(1)}'}
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
      actual: "1",
      expected: "{number(1)}",
      target: {path: 'testRootElement.numberWithoutDecimalPlaces'},
      description: "Check actual value 1 is a number with 1 decimal places",
      pass: false
    });
  });

  it('should report a mismatch where the actual value is a number but the number of decimal places do not match the expected (decimal places present)', function () {
    var expectedMessage = [
      {path: 'testRootElement.numberWith1DecimalPlace', equals: '{number(2)}'}
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
      actual: "1.0",
      expected: "{number(2)}",
      target: {path: 'testRootElement.numberWith1DecimalPlace'},
      description: "Check actual value 1.0 is a number with 2 decimal places",
      pass: false
    });
  });

  it('should report a match where the actual value is a number with 0 decimal places', function () {
    var expectedMessage = [
      {path: 'testRootElement.numberWithoutDecimalPlaces', equals: '{number(0)}'}
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
      expected: "{number(0)}",
      target: {path: 'testRootElement.numberWithoutDecimalPlaces'},
      description: "Check actual value 1 is a number with 0 decimal places",
      pass: true
    });
  });

  it('should report a match where the actual value is a number with 2 decimal places', function () {
    var expectedMessage = [
      {path: 'testRootElement.numberWith2DecimalPlaces', equals: '{number(2)}'}
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
      actual: "100.10",
      expected: "{number(2)}",
      target: {path: 'testRootElement.numberWith2DecimalPlaces'},
      description: "Check actual value 100.10 is a number with 2 decimal places",
      pass: true
    });
  });

  it('should report a match where the actual value is a number with 1 decimal place but no number before the period', function () {
    var expectedMessage = [
      {path: 'testRootElement.numberWithNoNumberBeforePeriod', equals: '{number(2)}'}
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
      actual: ".12",
      expected: "{number(2)}",
      target: {path: 'testRootElement.numberWithNoNumberBeforePeriod'},
      description: "Check actual value .12 is a number with 2 decimal places",
      pass: true
    });
  });
});