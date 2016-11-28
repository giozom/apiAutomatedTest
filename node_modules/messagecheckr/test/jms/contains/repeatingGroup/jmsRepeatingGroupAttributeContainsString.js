describe('jms - repeating element attribute contains string', function () {

  var actualMsg =
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
         <testRootElement xmlns="http://www.testing.com/integration/event">
          <elementOne>
            <thingContainingRepeatingGroups>
              <RepeatingGroup>
                  <fieldOneOfRepeatingGroup testAttribute1="toffee">10001</fieldOneOfRepeatingGroup>
                  <fieldTwoOfRepeatingGroup testAttribute2="123">hello</fieldTwoOfRepeatingGroup>
              </RepeatingGroup>
              <RepeatingGroup>
                  <fieldOneOfRepeatingGroup testAttribute1="tea">10002</fieldOneOfRepeatingGroup>
                  <fieldTwoOfRepeatingGroup testAttribute2="123">goodbye</fieldTwoOfRepeatingGroup>
              </RepeatingGroup>
            </thingContainingRepeatingGroups>
          </elementOne>
        </testRootElement>`;


  it('should report a mismatch where the actual repeating group element\'s attribute does not contain the expected value', function () {
    var expectedMessage = [
      {repeatingGroup: {path: 'testRootElement.elementOne.thingContainingRepeatingGroups', repeater: 'RepeatingGroup', number: 1}, path: 'fieldOneOfRepeatingGroup', attribute: 'testAttribute1', contains: 'toffeee'},
      {repeatingGroup: {path: 'testRootElement.elementOne.thingContainingRepeatingGroups', repeater: 'RepeatingGroup', number: 2}, path: 'fieldOneOfRepeatingGroup', attribute: 'testAttribute1', contains: 'tee'}
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
      actual: 'toffee',
      expected: {contains: 'toffeee'},
      target: {repeatingGroup: {path: 'testRootElement.elementOne.thingContainingRepeatingGroups', repeater: 'RepeatingGroup', number: 1}, path: 'fieldOneOfRepeatingGroup', attribute: 'testAttribute1'},
      description: "Check actual value toffee contains toffeee",
      pass: false
    });

    assert.deepEqual(result.checks[2], {
      actual: 'tea',
      expected: {contains: 'tee'},
      target: {repeatingGroup: {path: 'testRootElement.elementOne.thingContainingRepeatingGroups', repeater: 'RepeatingGroup', number: 2}, path: 'fieldOneOfRepeatingGroup', attribute: 'testAttribute1'},
      description: "Check actual value tea contains tee",
      pass: false
    });
  });

  it('should report a match where the actual repeating group element\'s attribute value does contain the expected value', function () {
    var expectedMessage = [
      {repeatingGroup: {path: 'testRootElement.elementOne.thingContainingRepeatingGroups', repeater: 'RepeatingGroup', number: 1}, path: 'fieldOneOfRepeatingGroup', attribute: 'testAttribute1', contains: 'toffee'},
      {repeatingGroup: {path: 'testRootElement.elementOne.thingContainingRepeatingGroups', repeater: 'RepeatingGroup', number: 2}, path: 'fieldOneOfRepeatingGroup', attribute: 'testAttribute1', contains: 'te'}
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
      actual: 'toffee',
      expected: {contains: 'toffee'},
      target: {repeatingGroup: {path: 'testRootElement.elementOne.thingContainingRepeatingGroups', repeater: 'RepeatingGroup', number: 1}, path: 'fieldOneOfRepeatingGroup', attribute: 'testAttribute1'},
      description: "Check actual value toffee contains toffee",
      pass: true
    });

    assert.deepEqual(result.checks[2], {
      actual: 'tea',
      expected: {contains: 'te'},
      target: {repeatingGroup: {path: 'testRootElement.elementOne.thingContainingRepeatingGroups', repeater: 'RepeatingGroup', number: 2}, path: 'fieldOneOfRepeatingGroup', attribute: 'testAttribute1'},
      description: "Check actual value tea contains te",
      pass: true
    });
  });
});