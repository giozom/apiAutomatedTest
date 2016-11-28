describe('soap - sub root level check', function () {

  var actualMsg =
    `<soap-env:Envelope xmlns:soap-env="http://schemas.xmlsoap.org/soap/envelope/">
      <soap-env:Header/>
      <soap-env:Body>
          <subRootLevel>
            <elementAtSubRootLevel>checkMe</elementAtSubRootLevel>
          </subRootLevel>
      </soap-env:Body>
    </soap-env:Envelope>`;

  it('should report a match where the actual sub root level value does match the expected value', function () {
    var expectedMessage = [
      {path: 'SOAP-ENV:ENVELOPE.SOAP-ENV:Body.subRootLevel.elementAtSubRootLevel', equals: 'checkMe'}
    ];

    var result = messageCheckr({
      type: 'soap',
      verbose: true,
      actualMsg: actualMsg,
      expectedMsg: expectedMessage
    });

    assert.equal(result.allChecksPassed, true);
    assert.deepEqual(result.checks[1], {
      actual: 'checkMe',
      description: "Check actual value checkMe is equal to checkMe",
      expected: 'checkMe',
      pass: true,
      target: {path: 'SOAP-ENV:ENVELOPE.SOAP-ENV:Body.subRootLevel.elementAtSubRootLevel'}
    });
  });
});