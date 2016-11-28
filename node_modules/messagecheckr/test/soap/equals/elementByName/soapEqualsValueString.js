describe('soap - equals value check', function () {

  var actualMsg =
    `<soap-env:Envelope xmlns:soap-env="http://schemas.xmlsoap.org/soap/envelope/">
      <soap-env:Header/>
      <soap-env:Body>
          <checkJustTheValue>hello</checkJustTheValue>
      </soap-env:Body>
    </soap-env:Envelope>`;

  it('should report a match where an attribute\'s actual value matches the expected value', function () {
    var expectedMessage = [
      {path: 'SOAP-ENV:ENVELOPE.SOAP-ENV:Body.checkJustTheValue', equals: 'hello'}
    ];

    var result = messageCheckr({
      type: 'soap',
      verbose: true,
      actualMsg: actualMsg,
      expectedMsg: expectedMessage
    });

    assert.equal(result.allChecksPassed, true);
    assert.deepEqual(result.checks[1], {
      actual: 'hello',
      expected: 'hello',
      description: 'Check actual value hello is equal to hello',
      pass: true,
      target: {path: 'SOAP-ENV:ENVELOPE.SOAP-ENV:Body.checkJustTheValue'}
    });
  });
});