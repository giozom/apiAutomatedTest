describe('soap - attribute value check', function () {

  var actualMsg =
    `<soap-env:Envelope xmlns:soap-env="http://schemas.xmlsoap.org/soap/envelope/">
      <soap-env:Header testAttribute="testAttributeValueInsideSoapHeaderTag"></soap-env:Header>
      <soap-env:Body testAttribute="testAttributeValueInsideSoapBodyTag">
          <testAttributeElement testAttribute="testAttributeValue"></testAttributeElement>
      </soap-env:Body>
    </soap-env:Envelope>`;

  it('should report a match where an attribute\'s actual value matches the expected value (inside soap envelope tag)', function () {
    var expectedMessage = [
      {path: 'SOAP-ENV:Envelope', attribute: 'xmlns:SOAP-ENV', equals: 'http://schemas.xmlsoap.org/soap/envelope/'}
    ];

    var result = messageCheckr({
      type: 'soap',
      verbose: true,
      actualMsg: actualMsg,
      expectedMsg: expectedMessage
    });

    assert.equal(result.allChecksPassed, true);
    assert.deepEqual(result.checks[1], {
      actual: 'http://schemas.xmlsoap.org/soap/envelope/',
      expected: 'http://schemas.xmlsoap.org/soap/envelope/',
      description: 'Check actual value http://schemas.xmlsoap.org/soap/envelope/ is equal to http://schemas.xmlsoap.org/soap/envelope/',
      pass: true,
      target: {path: 'SOAP-ENV:Envelope', attribute: 'xmlns:SOAP-ENV'}
    });
  });

  it('should report a match where an attribute\'s actual value matches the expected value (inside soap header tag)', function () {
    var expectedMessage = [
      {path: 'SOAP-ENV:ENVELOPE.SOAP-ENV:Header', attribute: 'testAttribute', equals: 'testAttributeValueInsideSoapHeaderTag'}
    ];

    var result = messageCheckr({
      type: 'soap',
      verbose: true,
      actualMsg: actualMsg,
      expectedMsg: expectedMessage
    });

    assert.equal(result.allChecksPassed, true);
    assert.deepEqual(result.checks[1], {
      actual: 'testAttributeValueInsideSoapHeaderTag',
      expected: 'testAttributeValueInsideSoapHeaderTag',
      description: 'Check actual value testAttributeValueInsideSoapHeaderTag is equal to testAttributeValueInsideSoapHeaderTag',
      pass: true,
      target: {path: 'SOAP-ENV:ENVELOPE.SOAP-ENV:Header', attribute: 'testAttribute'}
    });
  });

  it('should report a match where an attribute\'s actual value matches the expected value (inside soap body tag)', function () {
    var expectedMessage = [
      {path: 'SOAP-ENV:ENVELOPE.SOAP-ENV:Body', attribute: 'testAttribute', equals: 'testAttributeValueInsideSoapBodyTag'}
    ];

    var result = messageCheckr({
      type: 'soap',
      verbose: true,
      actualMsg: actualMsg,
      expectedMsg: expectedMessage
    });

    assert.equal(result.allChecksPassed, true);
    assert.deepEqual(result.checks[1], {
      actual: 'testAttributeValueInsideSoapBodyTag',
      expected: 'testAttributeValueInsideSoapBodyTag',
      description: 'Check actual value testAttributeValueInsideSoapBodyTag is equal to testAttributeValueInsideSoapBodyTag',
      pass: true,
      target: {path: 'SOAP-ENV:ENVELOPE.SOAP-ENV:Body', attribute: 'testAttribute'}
    });
  });

  it('should report a match where an attribute\'s actual value matches the expected value (inside a non soap-env prefixed tag)', function () {
    var expectedMessage = [
      {path: 'SOAP-ENV:ENVELOPE.SOAP-ENV:Body.testAttributeElement', attribute: 'testAttribute', equals: 'testAttributeValue'}
    ];

    var result = messageCheckr({
      type: 'soap',
      verbose: true,
      actualMsg: actualMsg,
      expectedMsg: expectedMessage
    });

    assert.equal(result.allChecksPassed, true);
    assert.deepEqual(result.checks[1], {
      actual: 'testAttributeValue',
      expected: 'testAttributeValue',
      description: 'Check actual value testAttributeValue is equal to testAttributeValue',
      pass: true,
      target: {path: 'SOAP-ENV:ENVELOPE.SOAP-ENV:Body.testAttributeElement', attribute: 'testAttribute'}
    });
  });
});