describe('jms - path checks', function () {
  var actualMsg = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
  <testRootElement xmlns="http://www.testing.com/integration/event">
    <subRootLevel>
      <field>checkingPathIsPresent</field>
    </subRootLevel>
  </testRootElement>`;

  it('should report a path is not present where the specified path does not exist', function () {
    var expectedMessage = [
      {path: 'subRootLevel.fieldDoesNotExist', equals: 'checkingPathIsPresent'}
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
      target: {path: 'subRootLevel.fieldDoesNotExist'},
      description: 'Check path does exist',
      pass: false
    });
  });

  it('should report a path to an attribute is not present where the specified path does exist', function () {
    var expectedMessage = [
      {path: 'testRootElement', attribute: 'wrong', equals: 'http://www.testing.com/integration/event'}
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
      target: {path: 'testRootElement', attribute: 'wrong'},
      description: 'Check path does exist',
      pass: false
    });
  });

  it('should report the root path is not present where the expectedRootElement does not exist', function () {
    var expectedMessage = [
      {path: 'subRootLevel.field', equals: 'checkingPathIsPresent'}
    ];

    var result = messageCheckr({
      type: 'jms',
      verbose: true,
      actualMsg: actualMsg,
      expectedMsg: expectedMessage,
      expectedRootElement: 'testRootElementDoesNotExist'
    });

    assert.equal(result.allChecksPassed, false);
    assert.deepEqual(result.checks[0], {
      actual: "testRootElement",
      expected: "testRootElementDoesNotExist",
      description: 'Check actual root element testRootElement is equal to expected root element testRootElementDoesNotExist',
      pass: false,
      target: 'testRootElementDoesNotExist'
    });
  });
});
