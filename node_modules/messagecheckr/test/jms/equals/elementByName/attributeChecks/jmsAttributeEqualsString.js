describe('jms - attribute value check', function () {
  var actualMsg = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
  <testRootElement xmlns="http://www.testing.com/integration/event"></testRootElement>`;

  it('should report a mismatch where an attribute\'s actual value does not match the expected value', function () {
    var expectedMessage = [
      {path: 'testRootElement', attribute: 'xmlns', equals: 'http://www.testing.com/integration/event_willNotMatchThisBit'}
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
      actual: 'http://www.testing.com/integration/event',
      expected: 'http://www.testing.com/integration/event_willNotMatchThisBit',
      target: {path: 'testRootElement', attribute: 'xmlns'},
      description: 'Check actual value http://www.testing.com/integration/event is equal to http://www.testing.com/integration/event_willNotMatchThisBit',
      pass: false
    });
  });

  it('should report a match where an attribute\'s actual value matches the expected value', function () {
    var expectedMessage = [
      {path: 'testRootElement', attribute: 'xmlns', equals: 'http://www.testing.com/integration/event'}
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
      actual: 'http://www.testing.com/integration/event',
      expected: 'http://www.testing.com/integration/event',
      target: {path: 'testRootElement', attribute: 'xmlns'},
      description: 'Check actual value http://www.testing.com/integration/event is equal to http://www.testing.com/integration/event',
      pass: true
    });
  });
});