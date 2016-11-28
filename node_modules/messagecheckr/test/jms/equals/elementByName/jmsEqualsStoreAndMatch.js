describe('jms - store and match check', function () {

  var actualMsg = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
  <testRootElement xmlns="http://www.testing.com/integration/event">
    <validUuidElement>49276fbd-d143-4fb4-9a00-6b60ae6b0c9e</validUuidElement>
    <duplicateOfUuidElementAbove>49276fbd-d143-4fb4-9a00-6b60ae6b0c9e</duplicateOfUuidElementAbove>
    <uuidDifferentToAbove>49276fbd-d143-4fb4-9a00-6b60ae6b0d1f</uuidDifferentToAbove>
  </testRootElement>`;

  it('should report a mismatch where {store} value does not the {matches} value', function () {
    var expectedMessage = [
      {path: 'testRootElement.validUuidElement', equals: '{store(nameForGuidField)}'},
      {path: 'testRootElement.uuidDifferentToAbove', equals: '{matches(nameForGuidField)}'}
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
      actual: "49276fbd-d143-4fb4-9a00-6b60ae6b0d1f",
      description: "Check actual value 49276fbd-d143-4fb4-9a00-6b60ae6b0d1f matches value 49276fbd-d143-4fb4-9a00-6b60ae6b0c9e in {store(nameForGuidField)}",
      expected: {equals: '{matches(nameForGuidField)}'},
      pass: false,
      target: {path: 'testRootElement.uuidDifferentToAbove'}
    });
  });

  it('should report a match where the actual element is a valid UUID', function () {
    var expectedMessage = [
      {path: 'testRootElement.validUuidElement', equals: '{store(nameForGuidFieldTwo)}'},
      {path: 'testRootElement.duplicateOfUuidElementAbove', equals: '{matches(nameForGuidFieldTwo)}'}
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
      actual: "49276fbd-d143-4fb4-9a00-6b60ae6b0c9e",
      description: "Check actual value 49276fbd-d143-4fb4-9a00-6b60ae6b0c9e matches value 49276fbd-d143-4fb4-9a00-6b60ae6b0c9e in {store(nameForGuidFieldTwo)}",
      expected: {equals: '{matches(nameForGuidFieldTwo)}'},
      pass: true,
      target: {path: 'testRootElement.duplicateOfUuidElementAbove'}
    });
  });
});