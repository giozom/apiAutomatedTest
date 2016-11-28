describe('jms - repeating element contains integer', function () {

  var actualMsg = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
  <testRootElement xmlns="http://www.testing.com/integration/event">
    <thingContainingRepeatingGroups>
        <RepeatingGroup>
            <fieldOneOfRepeatingGroup>10001</fieldOneOfRepeatingGroup>
            <fieldTwoOfRepeatingGroup>10003</fieldTwoOfRepeatingGroup>
        </RepeatingGroup>
        <RepeatingGroup>
            <fieldOneOfRepeatingGroup>10002</fieldOneOfRepeatingGroup>
            <fieldTwoOfRepeatingGroup>10004</fieldTwoOfRepeatingGroup>
        </RepeatingGroup>
    </thingContainingRepeatingGroups>
  </testRootElement>`;

  it('should report a mismatch where the actual repeating group element value does not contain the expected value', function () {
    var expectedMessage = [
      {repeatingGroup: {path: 'testRootElement.thingContainingRepeatingGroups', repeater: 'RepeatingGroup', number: 1}, path: 'fieldOneOfRepeatingGroup', contains: 10002},
      {repeatingGroup: {path: 'testRootElement.thingContainingRepeatingGroups', repeater: 'RepeatingGroup', number: 1}, path: 'fieldTwoOfRepeatingGroup', contains: 10004},
      {repeatingGroup: {path: 'testRootElement.thingContainingRepeatingGroups', repeater: 'RepeatingGroup', number: 2}, path: 'fieldOneOfRepeatingGroup', contains: 10001},
      {repeatingGroup: {path: 'testRootElement.thingContainingRepeatingGroups', repeater: 'RepeatingGroup', number: 2}, path: 'fieldTwoOfRepeatingGroup', contains: 10003}
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
      actual: '10001',
      expected: {contains: 10002},
      target: {repeatingGroup: {path: 'testRootElement.thingContainingRepeatingGroups', repeater: 'RepeatingGroup', number: 1}, path: 'fieldOneOfRepeatingGroup'},
      description: "Check actual value 10001 contains 10002",
      pass: false
    });

    assert.deepEqual(result.checks[2], {
      actual: '10003',
      expected: {contains: 10004},
      target: {repeatingGroup: {path: 'testRootElement.thingContainingRepeatingGroups', repeater: 'RepeatingGroup', number: 1}, path: 'fieldTwoOfRepeatingGroup'},
      description: "Check actual value 10003 contains 10004",
      pass: false
    });

    assert.deepEqual(result.checks[3], {
      actual: '10002',
      expected: {contains: 10001},
      target: {repeatingGroup: {path: 'testRootElement.thingContainingRepeatingGroups', repeater: 'RepeatingGroup', number: 2}, path: 'fieldOneOfRepeatingGroup'},
      description: "Check actual value 10002 contains 10001",
      pass: false
    });

    assert.deepEqual(result.checks[4], {
      actual: '10004',
      expected: {contains: 10003},
      target: {repeatingGroup: {path: 'testRootElement.thingContainingRepeatingGroups', repeater: 'RepeatingGroup', number: 2}, path: 'fieldTwoOfRepeatingGroup'},
      description: "Check actual value 10004 contains 10003",
      pass: false
    });
  });

  it('should report a match where the actual repeating group element value does contain the expected value', function () {
    var expectedMessage = [
      {repeatingGroup: {path: 'testRootElement.thingContainingRepeatingGroups', repeater: 'RepeatingGroup', number: 1}, path: 'fieldOneOfRepeatingGroup', contains: 10001},
      {repeatingGroup: {path: 'testRootElement.thingContainingRepeatingGroups', repeater: 'RepeatingGroup', number: 1}, path: 'fieldTwoOfRepeatingGroup', contains: 10003},
      {repeatingGroup: {path: 'testRootElement.thingContainingRepeatingGroups', repeater: 'RepeatingGroup', number: 2}, path: 'fieldOneOfRepeatingGroup', contains: 10002},
      {repeatingGroup: {path: 'testRootElement.thingContainingRepeatingGroups', repeater: 'RepeatingGroup', number: 2}, path: 'fieldTwoOfRepeatingGroup', contains: 10004}
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
      actual: '10001',
      expected: {contains: 10001},
      target: {repeatingGroup: {path: 'testRootElement.thingContainingRepeatingGroups', repeater: 'RepeatingGroup', number: 1}, path: 'fieldOneOfRepeatingGroup'},
      description: "Check actual value 10001 contains 10001",
      pass: true
    });

    assert.deepEqual(result.checks[2], {
      actual: '10003',
      expected: {contains: 10003},
      target: {repeatingGroup: {path: 'testRootElement.thingContainingRepeatingGroups', repeater: 'RepeatingGroup', number: 1}, path: 'fieldTwoOfRepeatingGroup'},
      description: "Check actual value 10003 contains 10003",
      pass: true
    });

    assert.deepEqual(result.checks[3], {
      actual: '10002',
      expected: {contains: 10002},
      target: {repeatingGroup: {path: 'testRootElement.thingContainingRepeatingGroups', repeater: 'RepeatingGroup', number: 2}, path: 'fieldOneOfRepeatingGroup'},
      description: "Check actual value 10002 contains 10002",
      pass: true
    });

    assert.deepEqual(result.checks[4], {
      actual: '10004',
      expected: {contains: 10004},
      target: {repeatingGroup: {path: 'testRootElement.thingContainingRepeatingGroups', repeater: 'RepeatingGroup', number: 2}, path: 'fieldTwoOfRepeatingGroup'},
      description: "Check actual value 10004 contains 10004",
      pass: true
    });
  });
});