describe('jms - repeating element attribute contains integer', function () {

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
      {repeatingGroup: {path: 'testRootElement.elementOne.thingContainingRepeatingGroups', repeater: 'RepeatingGroup', number: 1}, path: 'fieldTwoOfRepeatingGroup', attribute: 'testAttribute2', contains: 1234},
      {repeatingGroup: {path: 'testRootElement.elementOne.thingContainingRepeatingGroups', repeater: 'RepeatingGroup', number: 2}, path: 'fieldTwoOfRepeatingGroup', attribute: 'testAttribute2', contains: 124}
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
      actual: '123',
      expected: {contains: 1234},
      target: {repeatingGroup: {path: 'testRootElement.elementOne.thingContainingRepeatingGroups', repeater: 'RepeatingGroup', number: 1}, path: 'fieldTwoOfRepeatingGroup', attribute: 'testAttribute2'},
      description: "Check actual value 123 contains 1234",
      pass: false
    });

    assert.deepEqual(result.checks[2], {
      actual: '123',
      expected: {contains: 124},
      target: {repeatingGroup: {path: 'testRootElement.elementOne.thingContainingRepeatingGroups', repeater: 'RepeatingGroup', number: 2}, path: 'fieldTwoOfRepeatingGroup', attribute: 'testAttribute2'},
      description: "Check actual value 123 contains 124",
      pass: false
    });
  });

  it('should report a match where the actual repeating group element\'s attribute value does contain the expected value', function () {
    var expectedMessage = [
      {repeatingGroup: {path: 'testRootElement.elementOne.thingContainingRepeatingGroups', repeater: 'RepeatingGroup', number: 1}, path: 'fieldTwoOfRepeatingGroup', attribute: 'testAttribute2', contains: 123},
      {repeatingGroup: {path: 'testRootElement.elementOne.thingContainingRepeatingGroups', repeater: 'RepeatingGroup', number: 2}, path: 'fieldTwoOfRepeatingGroup', attribute: 'testAttribute2', contains: 12}
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
      actual: '123',
      expected: {contains: 123},
      target: {repeatingGroup: {path: 'testRootElement.elementOne.thingContainingRepeatingGroups', repeater: 'RepeatingGroup', number: 1}, path: 'fieldTwoOfRepeatingGroup', attribute: 'testAttribute2'},
      description: "Check actual value 123 contains 123",
      pass: true
    });

    assert.deepEqual(result.checks[2], {
      actual: '123',
      expected: {contains: 12},
      target: {repeatingGroup: {path: 'testRootElement.elementOne.thingContainingRepeatingGroups', repeater: 'RepeatingGroup', number: 2}, path: 'fieldTwoOfRepeatingGroup', attribute: 'testAttribute2'},
      description: "Check actual value 123 contains 12",
      pass: true
    });
  });
});