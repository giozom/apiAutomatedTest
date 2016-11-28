describe('jms - store check', function () {

  var actualMsg = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
  <testRootElement xmlns="http://www.testing.com/integration/event">
    <validUuidElement>49276fbd-d143-4fb4-9a00-6b60ae6b0c9e</validUuidElement>
    <duplicateOfUuidElementAbove>49276fbd-d143-4fb4-9a00-6b60ae6b0c9e</duplicateOfUuidElementAbove>
    <uuidDifferentToAbove>49276fbd-d143-4fb4-9a00-6b60ae6b0d1f</uuidDifferentToAbove>
  </testRootElement>`;

  it('should throw an error where a store (name) is used more than once', function () {
    var expectedMessage = [
      {path: 'testRootElement.validUuidElement', equals: '{store(nameForGuidField)}'},
      {path: 'testRootElement.uuidDifferentToAbove', equals: '{store(nameForGuidField)}'}
    ];

    assert.throws(function () {
        messageCheckr({
          type: 'jms',
          verbose: true,
          actualMsg: actualMsg,
          expectedMsg: expectedMessage,
          expectedRootElement: 'testRootElement'
        })
      }, Error, 'The store name you have provided is already is use.'
    );
  });

  it('should throw an error where a store (name) includes a number', function () {
    var expectedMessage = [
      {path: 'testRootElement.validUuidElement', equals: '{store(nameIncludingNumber1)}'}
    ];

    assert.throws(function () {
        messageCheckr({
          type: 'jms',
          verbose: true,
          actualMsg: actualMsg,
          expectedMsg: expectedMessage,
          expectedRootElement: 'testRootElement'
        })
      }, Error, 'Store name \'nameIncludingNumber1\' is only allowed to consist of characters.'
    );
  });

  it('should throw an error where a store (name) includes a non alphabetical character', function () {
    var expectedMessage = [
      {path: 'testRootElement.validUuidElement', equals: '{store(nameIncludingANonAlphabeticCharacter$)}'}
    ];

    assert.throws(function () {
        messageCheckr({
          type: 'jms',
          verbose: true,
          actualMsg: actualMsg,
          expectedMsg: expectedMessage,
          expectedRootElement: 'testRootElement'
        })
      }, Error, 'Store name \'nameIncludingANonAlphabeticCharacter$\' is only allowed to consist of characters.'
    );
  });
});