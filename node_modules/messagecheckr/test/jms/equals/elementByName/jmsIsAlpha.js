describe('jms - is alpha check', function () {

  var actualMsg = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
  <testRootElement xmlns="http://www.testing.com/integration/event">
    <integerField>1</integerField>
    <lettersOnlyField>abc</lettersOnlyField>
    <oneLetterField>z</oneLetterField>
    <mixedNumberAndAlphabeticalField>ab1c</mixedNumberAndAlphabeticalField>
  </testRootElement>`;

  it('should report a mismatch where the actual value is not just letters - it is an integer', function () {
    var expectedMessage = [
      {path: 'testRootElement.integerField', equals: '{alpha}'}
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
      description: "Check actual value 1 is alpha",
      expected: "{alpha}",
      pass: false,
      target: {path: 'testRootElement.integerField'}
    });
  });

  it('should report a mismatch where the actual value is not just letters - it is combination of letters and an integer', function () {
    var expectedMessage = [
      {path: 'testRootElement.mixedNumberAndAlphabeticalField', equals: '{alpha}'}
    ];

    var result = messageCheckr({
      type: 'jms',
      verbose: true,
      actualMsg: actualMsg,
      expectedMsg: expectedMessage,
      expectedRootElement: 'testRootElement.testRootElement'
    });

    assert.equal(result.allChecksPassed, false);
    assert.deepEqual(result.checks[1], {
      actual: "ab1c",
      expected: "{alpha}",
      description: "Check actual value ab1c is alpha",
      pass: false,
      target: {path: 'testRootElement.mixedNumberAndAlphabeticalField'}
    });
  });

  it('should report a match where the actual value is alpha (more than 1 letter)', function () {
    var expectedMessage = [
      {path: 'testRootElement.lettersOnlyField', equals: '{alpha}'}
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
      actual: "abc",
      expected: "{alpha}",
      description: "Check actual value abc is alpha",
      pass: true,
      target: {path: 'testRootElement.lettersOnlyField'}
    });
  });

  it('should report a match where the actual value is alpha (1 letter)', function () {
    var expectedMessage = [
      {path: 'testRootElement.oneLetterField', equals: '{alpha}'}
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
      actual: "z",
      expected: "{alpha}",
      description: "Check actual value z is alpha",
      pass: true,
      target: {path: 'testRootElement.oneLetterField'}
    });
  });
});