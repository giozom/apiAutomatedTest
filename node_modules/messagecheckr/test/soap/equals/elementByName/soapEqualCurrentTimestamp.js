var moment = require('moment');

describe('soap - timestamp check', function () {

  it('should report a match where the actual value matches the expected value (local time in the format - YYYY-MM-DDTdd:dd:dd.ddd+dd:dd)', function () {
    var currentDateTimeLocal, currentDate, actualMsg, expectedMessage, dateRegexPattern;

    currentDateTimeLocal = moment().format('YYYY-MM-DDTHH:mm:ss.SSSZ');
    currentDate = moment().format('YYYY-MM-DD');
    actualMsg =
      `<soap-env:Envelope xmlns:soap-env="http://schemas.xmlsoap.org/soap/envelope/">
      <soap-env:Header/>
      <soap-env:Body>
          <dateElement>` + currentDateTimeLocal + `</dateElement>
      </soap-env:Body>
    </soap-env:Envelope>`;

    dateRegexPattern = /local-timezoneT\d\d:\d\d:\d\d\.\d\d\d\+\d\d:\d\d/;
    expectedMessage = [
      {path: 'SOAP-ENV:ENVELOPE.SOAP-ENV:Body.dateElement', equals: dateRegexPattern, dateFormat: 'YYYY-MM-DD'}
    ];

    var result = messageCheckr({
      type: 'soap',
      verbose: true,
      actualMsg: actualMsg,
      expectedMsg: expectedMessage
    });

    assert.equal(result.allChecksPassed, true);
    assert.deepEqual(result.checks[1], {
      actual: currentDateTimeLocal,
      expected: {equals: dateRegexPattern, dateFormat: 'YYYY-MM-DD'},
      target: {path: 'SOAP-ENV:ENVELOPE.SOAP-ENV:Body.dateElement'},
      description: 'Check actual value ' + currentDateTimeLocal + ' matches date/regex pattern ' + dateRegexPattern.toString().replace('local-timezone', currentDate),
      pass: true
    });
  });
});