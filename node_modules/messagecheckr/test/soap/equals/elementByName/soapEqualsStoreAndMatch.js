describe('soap - store and match check', function () {

  var actualMsg =
    `<soap-env:Envelope xmlns:soap-env="http://schemas.xmlsoap.org/soap/envelope/">
      <soap-env:Header/>
      <soap-env:Body>
        <validUuidElement>49276fbd-d143-4fb4-9a00-6b60ae6b0c9e</validUuidElement>
        <duplicateOfUuidElementAbove>49276fbd-d143-4fb4-9a00-6b60ae6b0c9e</duplicateOfUuidElementAbove>
      </soap-env:Body>
    </soap-env:Envelope>`;

  it('should report a match where the actual element is a valid UUID', function () {
    var expectedMessage = [
      {path: 'SOAP-ENV:ENVELOPE.SOAP-ENV:Body.validUuidElement', equals: '{store(nameForGuidFieldTwo)}'},
      {path: 'SOAP-ENV:ENVELOPE.SOAP-ENV:Body.duplicateOfUuidElementAbove', equals: '{matches(nameForGuidFieldTwo)}'}
    ];

    var result = messageCheckr({
      type: 'soap',
      verbose: true,
      actualMsg: actualMsg,
      expectedMsg: expectedMessage
    });

    assert.equal(result.allChecksPassed, true);
    assert.deepEqual(result.checks[1], {
      actual: '49276fbd-d143-4fb4-9a00-6b60ae6b0c9e',
      description: 'Check actual value 49276fbd-d143-4fb4-9a00-6b60ae6b0c9e matches value 49276fbd-d143-4fb4-9a00-6b60ae6b0c9e in {store(nameForGuidFieldTwo)}',
      expected: {equals: '{matches(nameForGuidFieldTwo)}'},
      pass: true,
      target: {path: 'SOAP-ENV:ENVELOPE.SOAP-ENV:Body.duplicateOfUuidElementAbove'}
    });
  });
});