describe('jms - sub root level check', function () {

  var actualMsg = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
  <testRootElement xmlns="http://www.testing.com/integration/event">
    <subRootLevel>
        <elementAtSubRootLevel>checkMe</elementAtSubRootLevel>
    </subRootLevel>
  </testRootElement>`;

  it('should report a mismatch where the actual sub root level value does not the expected value', function () {
    var expectedMessage = [
      {path: 'testRootElement.subRootLevel.elementAtSubRootLevel', equals: 'willNotMatch'}
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
      actual: 'checkMe',
      description: "Check actual value checkMe is equal to willNotMatch",
      expected: 'willNotMatch',
      pass: false,
      target: {path: 'testRootElement.subRootLevel.elementAtSubRootLevel'}
    });
  });

  it('should report a match where the actual sub root level value does match the expected value', function () {
    var expectedMessage = [
      {path: 'testRootElement.subRootLevel.elementAtSubRootLevel', equals: 'checkMe'}
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
      actual: 'checkMe',
      description: "Check actual value checkMe is equal to checkMe",
      expected: 'checkMe',
      pass: true,
      target: {path: 'testRootElement.subRootLevel.elementAtSubRootLevel'}
    });
  });
});