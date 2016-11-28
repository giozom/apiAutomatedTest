describe('soap - is alpha check', function () {

  var actualMsg =
    `<soap-env:Envelope xmlns:soap-env="http://schemas.xmlsoap.org/soap/envelope/">
      <soap-env:Header/>
      <soap-env:Body>
        <lettersOnlyField>abc</lettersOnlyField>
      </soap-env:Body>
    </soap-env:Envelope>`;


  it('should report a match where the actual value is alpha (more than 1 letter)', function () {
    var expectedMessage = [
      {path: 'SOAP-ENV:ENVELOPE.SOAP-ENV:Body.lettersOnlyField', equals: '{alpha}'}
    ];

    var result = messageCheckr({
      type: 'soap',
      verbose: true,
      actualMsg: actualMsg,
      expectedMsg: expectedMessage
    });

    assert.equal(result.allChecksPassed, true);
    assert.deepEqual(result.checks[1], {
      actual: 'abc',
      expected: '{alpha}',
      target: {path: 'SOAP-ENV:ENVELOPE.SOAP-ENV:Body.lettersOnlyField'},
      description: "Check actual value abc is alpha",
      pass: true
    });
  });
});