var cleanRawSoapMessage = require('../libs/cleanRawSoapMessage.js');

describe('cleanRawSoapMessage()', function () {

  it('should convert all references of soap-env to SOAP-ENV', function () {
    var result, actualMsg, expectedMsg;

    actualMsg =
      `<soap-env:Envelope xmlns:soap-env="http://schemas.xmlsoap.org/soap/envelope/">
      <soap-env:Header/>
      <soap-env:Body>
          <element>hello</element>
      </soap-env:Body>
    </soap-env:Envelope>`;

    expectedMsg =
      `<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/">
      <SOAP-ENV:Header/>
      <SOAP-ENV:Body>
          <element>hello</element>
      </SOAP-ENV:Body>
    </SOAP-ENV:Envelope>`;

    result = cleanRawSoapMessage(actualMsg);
    assert.equal(result, expectedMsg);
  });

  it('should convert all references of soapenv to SOAP-ENV', function () {
    var result, actualMsg, expectedMsg;

    actualMsg =
      `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
      <soapenv:Header/>
      <soapenv:Body>
          <element>hello</element>
      </soapenv:Body>
    </soapenv:Envelope>`;

    expectedMsg =
      `<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/">
      <SOAP-ENV:Header/>
      <SOAP-ENV:Body>
          <element>hello</element>
      </SOAP-ENV:Body>
    </SOAP-ENV:Envelope>`;

    result = cleanRawSoapMessage(actualMsg);
    assert.equal(result, expectedMsg);
  });

  it('should leave all references of SOAP-ENV unchanged', function () {
    var result, actualMsg;

    actualMsg =
      `<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/">
      <SOAP-ENV:Header/>
      <SOAP-ENV:Body>
          <element>hello</element>
      </SOAP-ENV:Body>
    </SOAP-ENV:Envelope>`;

    result = cleanRawSoapMessage(actualMsg);
    assert.equal(result, actualMsg);
  });
});