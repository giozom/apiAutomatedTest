describe('soap - integer value check', function () {

  var actualMsg =
    `<soap-env:Envelope xmlns:soap-env="http://schemas.xmlsoap.org/soap/envelope/">
      <soap-env:Header/>
      <soap-env:Body>
        <integerFieldWith1Digit>1</integerFieldWith1Digit>
      </soap-env:Body>
    </soap-env:Envelope>`;

  it('should report a match where the actual integer value matches the expected integer value - single digit', function () {
    var expectedMessage = [
      {path: 'SOAP-ENV:ENVELOPE.SOAP-ENV:Body.integerFieldWith1Digit', equals: 1}
    ];

    var result = messageCheckr({
      type: 'soap',
      verbose: true,
      actualMsg: actualMsg,
      expectedMsg: expectedMessage
    });

    assert.equal(result.allChecksPassed, true);
    assert.deepEqual(result.checks[1], {
      actual: 1,
      description: "Check actual value 1 is equal to 1",
      expected: {equals: 1},
      pass: true,
      target: {path: 'SOAP-ENV:ENVELOPE.SOAP-ENV:Body.integerFieldWith1Digit'}
    });
  });
});