describe('jms - length check', function () {
  var actualMsg = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
  <testRootElement xmlns="http://www.testing.com/integration/event">
    <elementToCheckLengthOf>thisIs22CharactersLong</elementToCheckLengthOf>
  </testRootElement>`;

  it('should report a mismatch where an element\'s actual length does not match the expected length', function () {
    var expectedMessage = [
      {path: 'testRootElement.elementToCheckLengthOf', equals: '{length(21)}'}
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
      actual: 'thisIs22CharactersLong',
      expected: '{length(21)}',
      target: {path: 'testRootElement.elementToCheckLengthOf'},
      description: 'Check actual value thisIs22CharactersLong has a length equal to 21',
      pass: false
    });
  });

  it('should report a match where an element\'s actual length does match the expected length', function () {
    var expectedMessage = [
      {path: 'testRootElement.elementToCheckLengthOf', equals: '{length(22)}'}
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
      actual: 'thisIs22CharactersLong',
      expected: '{length(22)}',
      target: {path: 'testRootElement.elementToCheckLengthOf'},
      description: 'Check actual value thisIs22CharactersLong has a length equal to 22',
      pass: true
    });
  });

  it('should report a mismatch where an element\'s actual length is not less than the given < expected length', function () {
    var expectedMessage = [
      {path: 'testRootElement.elementToCheckLengthOf', equals: '{length(<22)}'}
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
      actual: 'thisIs22CharactersLong',
      expected: '{length(<22)}',
      target: {path: 'testRootElement.elementToCheckLengthOf'},
      description: 'Check actual value thisIs22CharactersLong has a length less than 22',
      pass: false
    });
  });

  it('should report a match where an element\'s actual length is less than the given (< expected length)', function () {
    var expectedMessage = [
      {path: 'testRootElement.elementToCheckLengthOf', equals: '{length(<23)}'}
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
      actual: 'thisIs22CharactersLong',
      expected: '{length(<23)}',
      target: {path: 'testRootElement.elementToCheckLengthOf'},
      description: 'Check actual value thisIs22CharactersLong has a length less than 23',
      pass: true
    });
  });

  it('should report a mismatch where an element\'s actual length is not greater than the given > expected length', function () {
    var expectedMessage = [
      {path: 'testRootElement.elementToCheckLengthOf', equals: '{length(>22)}'}
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
      actual: 'thisIs22CharactersLong',
      expected: '{length(>22)}',
      target: {path: 'testRootElement.elementToCheckLengthOf'},
      description: 'Check actual value thisIs22CharactersLong has a length greater than 22',
      pass: false
    });
  });

  it('should report a match where an element\'s actual length is greater than the given (> expected length)', function () {
    var expectedMessage = [
      {path: 'testRootElement.elementToCheckLengthOf', equals: '{length(>21)}'}
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
      actual: 'thisIs22CharactersLong',
      expected: '{length(>21)}',
      target: {path: 'testRootElement.elementToCheckLengthOf'},
      description: 'Check actual value thisIs22CharactersLong has a length greater than 21',
      pass: true
    });
  });
});