describe('soap - regex check', function () {

  var actualMsg =
    `<soap-env:Envelope xmlns:soap-env="http://schemas.xmlsoap.org/soap/envelope/">
      <soap-env:Header/>
      <soap-env:Body>
          <elementToCheckRegex>2015-11-01T08:12:15.425+11:00</elementToCheckRegex>
      </soap-env:Body>
    </soap-env:Envelope>`;

  it('should report a match where the actual element matches the expected regex pattern', function () {
    var regexPattern, expectedMessage;

    regexPattern = /[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}\.[0-9]{3}\+[0-9]{2}:[0-9]{2}/;
    expectedMessage = [
      {path: 'SOAP-ENV:ENVELOPE.SOAP-ENV:Body.elementToCheckRegex', equals: regexPattern}
    ];

    var result = messageCheckr({
      type: 'soap',
      verbose: true,
      actualMsg: actualMsg,
      expectedMsg: expectedMessage
    });

    assert.equal(result.allChecksPassed, true);
    assert.deepEqual(result.checks[1], {
      actual: '2015-11-01T08:12:15.425+11:00',
      expected: {equals: regexPattern},
      target: {path: 'SOAP-ENV:ENVELOPE.SOAP-ENV:Body.elementToCheckRegex'},
      description: 'Check actual value 2015-11-01T08:12:15.425+11:00 against regex ' + regexPattern,
      pass: true
    });
  });
});