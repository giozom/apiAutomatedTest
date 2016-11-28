describe('soap - is integer check', function () {

  var actualMsg =
    `<soap-env:Envelope xmlns:soap-env="http://schemas.xmlsoap.org/soap/envelope/">
      <soap-env:Header/>
      <soap-env:Body>
          <integerFieldWithMoreThan1Digit>12345</integerFieldWithMoreThan1Digit>
      </soap-env:Body>
    </soap-env:Envelope>`;

  it('should report a match where the actual value is an integer (12345)', function () {
    var expectedMessage = [
      {path: 'SOAP-ENV:ENVELOPE.SOAP-ENV:Body.integerFieldWithMoreThan1Digit', equals: '{integer}'}
    ];

    var result = messageCheckr({
      type: 'soap',
      verbose: true,
      actualMsg: actualMsg,
      expectedMsg: expectedMessage
    });

    assert.equal(result.allChecksPassed, true);
    assert.deepEqual(result.checks[1], {
      actual: '12345',
      expected: '{integer}',
      target: {path: 'SOAP-ENV:ENVELOPE.SOAP-ENV:Body.integerFieldWithMoreThan1Digit'},
      description: "Check actual value 12345 is an integer",
      pass: true
    });
  });
});