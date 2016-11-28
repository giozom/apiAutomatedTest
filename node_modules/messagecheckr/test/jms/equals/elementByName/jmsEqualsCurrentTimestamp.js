var moment = require('moment');

describe('jms - timestamp check', function () {

  it('should throw an error where the dateFormat attribute is missing and equals attribute contains local-timezone', function () {
    var currentDateTimeLocal, actualMsg;
    currentDateTimeLocal = moment().format('YYYY-MM-DDTHH:mm:ss.SSSZ');
    actualMsg = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
      <testRootElement xmlns="http://www.testing.com/integration/event">
        <dateElement>` + currentDateTimeLocal + `</dateElement>
      </testRootElement>`;

    var expectedMessageInvalidTimezone = [
      {path: 'testRootElement.dateElement', equals: /local-timezoneT\d\d:\d\d:\d\d\.\d\d\d\+\d\d:\d\d/}
    ];

    assert.throws(function () {
        messageCheckr({
          type: 'jms',
          verbose: true,
          actualMsg: actualMsg,
          expectedMsg: expectedMessageInvalidTimezone,
          expectedRootElement: 'testRootElement'
        })
      }, Error, 'Expected additional attribute \'dateFormat\' when local-timezone or utc-timezone is present in a regex literal for \'equals\''
    );
  });

  it('should throw an error where the dateFormat attribute is missing and equals attributes contains utc-timezone', function () {
    var currentDateTimeLocal, actualMsg;
    currentDateTimeLocal = moment().utc().format('YYYY-MM-DDTHH:mm:ss.SSSZ');
    actualMsg = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
      <testRootElement xmlns="http://www.testing.com/integration/event">
        <dateElement>` + currentDateTimeLocal + `</dateElement>
      </testRootElement>`;

    var expectedMessageInvalidTimezone = [
      {path: 'testRootElement.dateElement', equals: /utc-timezoneT\d\d:\d\d:\d\d\.\d\d\d\+\d\d:\d\d/}
    ];

    assert.throws(function () {
        messageCheckr({
          type: 'jms',
          verbose: true,
          actualMsg: actualMsg,
          expectedMsg: expectedMessageInvalidTimezone,
          expectedRootElement: 'testRootElement'
        })
      }, Error, 'Expected additional attribute \'dateFormat\' when local-timezone or utc-timezone is present in a regex literal for \'equals\''
    );
  });

  it('should report a mismatch where the actual value does not match the expected date (where timezone is local)', function () {
    var tomorrowDateTimeLocal, actualMsg, expectedMessage, currentDate, dateRegexPattern;

    tomorrowDateTimeLocal = moment().add(1, 'days').format('YYYY-MM-DDTHH:mm:ss.SSSZ');
    currentDate = moment().format('YYYY-MM-DD');
    actualMsg = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
      <testRootElement xmlns="http://www.testing.com/integration/event">
        <dateElement>` + tomorrowDateTimeLocal + `</dateElement>
      </testRootElement>`;
    dateRegexPattern = /local-timezoneT\d\d:\d\d:\d\d\.\d\d\d\+\d\d:\d\d/;
    expectedMessage = [
      {path: 'testRootElement.dateElement', equals: dateRegexPattern, dateFormat: 'YYYY-MM-DD'}
    ];

    var result = messageCheckr({
      type: 'jms',
      verbose: true,
      actualMsg: actualMsg,
      expectedMsg: expectedMessage,
      expectedRootElement: 'testRootElement'
    });

    assert.equal(result.allChecksPassed, false);
    assert.deepEqual(result.checks[1], {
      actual: tomorrowDateTimeLocal,
      expected: {equals: dateRegexPattern, dateFormat: 'YYYY-MM-DD'},
      target: {path: 'testRootElement.dateElement'},
      description: 'Check actual value ' + tomorrowDateTimeLocal + ' matches date/regex pattern ' + dateRegexPattern.toString().replace('local-timezone', currentDate),
      pass: false
    });
  });

  it('should report a mismatch where the actual value does not match the expected date (where timezone is utc)', function () {
    var tomorrowDateTimeLocal, actualMsg, expectedMessage, currentDate, dateRegexPattern;

    tomorrowDateTimeLocal = moment().utc().add(1, 'days').format('YYYY-MM-DDTHH:mm:ss.SSSZ');
    currentDate = moment().utc().format('YYYY-MM-DD');
    actualMsg = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
      <testRootElement xmlns="http://www.testing.com/integration/event">
        <dateElement>` + tomorrowDateTimeLocal + `</dateElement>
      </testRootElement>`;
    dateRegexPattern = /utc-timezoneT\d\d:\d\d:\d\d\.\d\d\d\+\d\d:\d\d/;
    expectedMessage = [
      {path: 'testRootElement.dateElement', equals: dateRegexPattern, dateFormat: 'YYYY-MM-DD'}
    ];

    var result = messageCheckr({
      type: 'jms',
      verbose: true,
      actualMsg: actualMsg,
      expectedMsg: expectedMessage,
      expectedRootElement: 'testRootElement'
    });

    assert.equal(result.allChecksPassed, false);
    assert.deepEqual(result.checks[1], {
      actual: tomorrowDateTimeLocal,
      expected: {equals: dateRegexPattern, dateFormat: 'YYYY-MM-DD'},
      target: {path: 'testRootElement.dateElement'},
      description: 'Check actual value ' + tomorrowDateTimeLocal + ' matches date/regex pattern ' + dateRegexPattern.toString().replace('utc-timezone', currentDate),
      pass: false
    });
  });

  it('should report a mismatch where the actual value does not match the expected date format', function () {
    var currentDateTimeLocal, currentDate, actualMsg, expectedMessage, dateRegexPattern;

    currentDateTimeLocal = moment().format('YYYY-MMM-DDTHH:mm:ss.SSSZ');
    currentDate = moment().format('YYYY-MM-DD');
    actualMsg = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
      <testRootElement xmlns="http://www.testing.com/integration/event">
        <dateElement>` + currentDateTimeLocal + `</dateElement>
      </testRootElement>`;
    dateRegexPattern = /local-timezoneT\d\d:\d\d:\d\d\.\d\d\d\+\d\d/;

    expectedMessage = [
      {path: 'testRootElement.dateElement', equals: dateRegexPattern, dateFormat: 'YYYY-MM-DD'}
    ];

    var result = messageCheckr({
      type: 'jms',
      verbose: true,
      actualMsg: actualMsg,
      expectedMsg: expectedMessage,
      expectedRootElement: 'testRootElement'
    });

    assert.equal(result.allChecksPassed, false);
    assert.deepEqual(result.checks[1], {
      actual: currentDateTimeLocal,
      expected: {equals: dateRegexPattern, dateFormat: 'YYYY-MM-DD'},
      target: {path: 'testRootElement.dateElement'},
      description: 'Check actual value ' + currentDateTimeLocal + ' matches date/regex pattern ' + dateRegexPattern.toString().replace('local-timezone', currentDate),
      pass: false
    });
  });

  it('should report a match where the actual value matches the expected value (local time in the format - YYYY-MM-DDTdd:dd:dd.ddd+dd:dd)', function () {
    var currentDateTimeLocal, currentDate, actualMsg, expectedMessage, dateRegexPattern;

    currentDateTimeLocal = moment().format('YYYY-MM-DDTHH:mm:ss.SSSZ');
    currentDate = moment().format('YYYY-MM-DD');
    actualMsg = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
      <testRootElement xmlns="http://www.testing.com/integration/event">
        <dateElement>` + currentDateTimeLocal + `</dateElement>
      </testRootElement>`;
    dateRegexPattern = /local-timezoneT\d\d:\d\d:\d\d\.\d\d\d\+\d\d:\d\d/;
    expectedMessage = [
      {path: 'testRootElement.dateElement', equals: dateRegexPattern, dateFormat: 'YYYY-MM-DD'}
    ];

    var result = messageCheckr({
      type: 'jms',
      verbose: true,
      actualMsg: actualMsg,
      expectedMsg: expectedMessage,
      expectedRootElement: 'testRootElement'
    });

    assert.equal(result.allChecksPassed, true);
    assert.deepEqual(result.checks[1], {
      actual: currentDateTimeLocal,
      expected: {equals: dateRegexPattern, dateFormat: 'YYYY-MM-DD'},
      target: {path: 'testRootElement.dateElement'},
      description: 'Check actual value ' + currentDateTimeLocal + ' matches date/regex pattern ' + dateRegexPattern.toString().replace('local-timezone', currentDate),
      pass: true
    });
  });

  it('should report a match where the actual value matches the expected value (utc time in the format - YYYY-MM-DDTdd:dd:dd.ddd+dd:dd)', function () {
    var currentDateTimeLocal, currentDate, actualMsg, expectedMessage, dateRegexPattern;

    currentDateTimeLocal = moment().utc().format('YYYY-MM-DDTHH:mm:ss.SSSZ');
    currentDate = moment().utc().format('YYYY-MM-DD');
    actualMsg = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
      <testRootElement xmlns="http://www.testing.com/integration/event">
        <dateElement>` + currentDateTimeLocal + `</dateElement>
      </testRootElement>`;
    dateRegexPattern = /^utc-timezoneT\d\d:\d\d:\d\d\.\d\d\d\+\d\d:\d\d/;
    expectedMessage = [
      {path: 'testRootElement.dateElement', equals: dateRegexPattern, dateFormat: 'YYYY-MM-DD'}
    ];

    var result = messageCheckr({
      type: 'jms',
      verbose: true,
      actualMsg: actualMsg,
      expectedMsg: expectedMessage,
      expectedRootElement: 'testRootElement'
    });

    assert.equal(result.allChecksPassed, true);
    assert.deepEqual(result.checks[1], {
      actual: currentDateTimeLocal,
      expected: {equals: dateRegexPattern, dateFormat: 'YYYY-MM-DD'},
      target: {path: 'testRootElement.dateElement'},
      description: 'Check actual value ' + currentDateTimeLocal + ' matches date/regex pattern ' + dateRegexPattern.toString().replace('utc-timezone', currentDate),
      pass: true
    });
  });

  it('should report a match where the actual value matches the expected value (local time in the format - YY-MM-DDTdd:dd:dd.ddd+dd:dd)', function () {
    var currentDateTimeLocal, currentDate, actualMsg, expectedMessage, dateRegexPattern;

    currentDateTimeLocal = moment().format('YY-MM-DDTHH:mm:ss.SSSZ');
    currentDate = moment().format('YY-MM-DD');
    actualMsg = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
      <testRootElement xmlns="http://www.testing.com/integration/event">
        <dateElement>` + currentDateTimeLocal + `</dateElement>
      </testRootElement>`;
    dateRegexPattern = /local-timezoneT\d\d:\d\d:\d\d\.\d\d\d\+\d\d:\d\d$/;
    expectedMessage = [
      {path: 'testRootElement.dateElement', equals: dateRegexPattern, dateFormat: 'YY-MM-DD'}
    ];

    var result = messageCheckr({
      type: 'jms',
      verbose: true,
      actualMsg: actualMsg,
      expectedMsg: expectedMessage,
      expectedRootElement: 'testRootElement'
    });

    assert.equal(result.allChecksPassed, true);
    assert.deepEqual(result.checks[1], {
      actual: currentDateTimeLocal,
      expected: {equals: dateRegexPattern, dateFormat: 'YY-MM-DD'},
      target: {path: 'testRootElement.dateElement'},
      description: 'Check actual value ' + currentDateTimeLocal + ' matches date/regex pattern ' + dateRegexPattern.toString().replace('local-timezone', currentDate),
      pass: true
    });
  });

  it('should report a match where the actual value matches the expected value (utc time in the format - YY-MM-DDTdd:dd:dd.ddd+dd:dd)', function () {
    var currentDateTimeLocal, currentDate, actualMsg, expectedMessage, dateRegexPattern;

    currentDateTimeLocal = moment().utc().format('YY-MM-DDTHH:mm:ss.SSSZ');
    currentDate = moment().utc().format('YY-MM-DD');
    actualMsg = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
      <testRootElement xmlns="http://www.testing.com/integration/event">
        <dateElement>` + currentDateTimeLocal + `</dateElement>
      </testRootElement>`;
    dateRegexPattern = /utc-timezoneT\d\d:\d\d:\d\d\.\d\d\d\+\d\d:\d\d/;
    expectedMessage = [
      {path: 'testRootElement.dateElement', equals: dateRegexPattern, dateFormat: 'YY-MM-DD'}
    ];

    var result = messageCheckr({
      type: 'jms',
      verbose: true,
      actualMsg: actualMsg,
      expectedMsg: expectedMessage,
      expectedRootElement: 'testRootElement'
    });

    assert.equal(result.allChecksPassed, true);
    assert.deepEqual(result.checks[1], {
      actual: currentDateTimeLocal,
      expected: {equals: dateRegexPattern, dateFormat: 'YY-MM-DD'},
      target: {path: 'testRootElement.dateElement'},
      description: 'Check actual value ' + currentDateTimeLocal + ' matches date/regex pattern ' + dateRegexPattern.toString().replace('utc-timezone', currentDate),
      pass: true
    });
  });

  it('should report a match where the actual value matches the expected value (local time in the format - D-M-YYYYTdd:dd:dd+dd:dd)', function () {
    var currentDateTimeLocal, currentDate, actualMsg, expectedMessage, dateRegexPattern;

    currentDateTimeLocal = moment().format('D-M-YYYYTHH:mm:ssZ');
    currentDate = moment().format('D-M-YYYY');
    actualMsg = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
      <testRootElement xmlns="http://www.testing.com/integration/event">
        <dateElement>` + currentDateTimeLocal + `</dateElement>
      </testRootElement>`;
    dateRegexPattern = /local-timezoneT\d\d:\d\d:\d\d\+\d\d:\d\d/;
    expectedMessage = [
      {path: 'testRootElement.dateElement', equals: dateRegexPattern, dateFormat: 'D-M-YYYY'}
    ];

    var result = messageCheckr({
      type: 'jms',
      verbose: true,
      actualMsg: actualMsg,
      expectedMsg: expectedMessage,
      expectedRootElement: 'testRootElement'
    });

    assert.equal(result.allChecksPassed, true);
    assert.deepEqual(result.checks[1], {
      actual: currentDateTimeLocal,
      expected: {equals: dateRegexPattern, dateFormat: 'D-M-YYYY'},
      target: {path: 'testRootElement.dateElement'},
      description: 'Check actual value ' + currentDateTimeLocal + ' matches date/regex pattern ' + dateRegexPattern.toString().replace('local-timezone', currentDate),
      pass: true
    });
  });

  it('should report a match where the actual value matches the expected value (utc time in the format - D-M-YYYYTdd:dd:dd+dd:dd)', function () {
    var currentDateTimeLocal, currentDate, actualMsg, expectedMessage, dateRegexPattern;

    currentDateTimeLocal = moment().utc().format('D-M-YYYYTHH:mm:ssZ');
    currentDate = moment().utc().format('D-M-YYYY');
    actualMsg = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
      <testRootElement xmlns="http://www.testing.com/integration/event">
        <dateElement>` + currentDateTimeLocal + `</dateElement>
      </testRootElement>`;
    dateRegexPattern = /utc-timezoneT\d\d:\d\d:\d\d\+\d\d:\d\d/;
    expectedMessage = [
      {path: 'testRootElement.dateElement', equals: dateRegexPattern, dateFormat: 'D-M-YYYY'}
    ];

    var result = messageCheckr({
      type: 'jms',
      verbose: true,
      actualMsg: actualMsg,
      expectedMsg: expectedMessage,
      expectedRootElement: 'testRootElement'
    });

    assert.equal(result.allChecksPassed, true);
    assert.deepEqual(result.checks[1], {
      actual: currentDateTimeLocal,
      expected: {equals: dateRegexPattern, dateFormat: 'D-M-YYYY'},
      target: {path: 'testRootElement.dateElement'},
      description: 'Check actual value ' + currentDateTimeLocal + ' matches date/regex pattern ' + dateRegexPattern.toString().replace('utc-timezone', currentDate),
      pass: true
    });
  });

  it('should report a match where the actual value matches the expected value (local time in the format - dd:dd:dd+dd:dd Do MMM YYYY)', function () {
    var currentDateTimeLocal, currentDate, actualMsg, expectedMessage, dateRegexPattern;

    currentDateTimeLocal = moment().format('HH:mm:ssZ Do MMM YYYY');
    currentDate = moment().format('Do MMM YYYY');
    actualMsg = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
      <testRootElement xmlns="http://www.testing.com/integration/event">
        <dateElement>` + currentDateTimeLocal + `</dateElement>
      </testRootElement>`;
    dateRegexPattern = /\d\d:\d\d:\d\d\+\d\d:\d\d local-timezone/;
    expectedMessage = [
      {path: 'testRootElement.dateElement', equals: dateRegexPattern, dateFormat: 'Do MMM YYYY'}
    ];

    var result = messageCheckr({
      type: 'jms',
      verbose: true,
      actualMsg: actualMsg,
      expectedMsg: expectedMessage,
      expectedRootElement: 'testRootElement'
    });

    assert.equal(result.allChecksPassed, true);
    assert.deepEqual(result.checks[1], {
      actual: currentDateTimeLocal,
      expected: {equals: dateRegexPattern, dateFormat: 'Do MMM YYYY'},
      target: {path: 'testRootElement.dateElement'},
      description: 'Check actual value ' + currentDateTimeLocal + ' matches date/regex pattern ' + dateRegexPattern.toString().replace('local-timezone', currentDate),
      pass: true
    });
  });

  it('should report a match where the actual value matches the expected value (utc time in the format - dd:dd:dd+dd:dd Do MMM YYYY)', function () {
    var currentDateTimeLocal, currentDate, actualMsg, expectedMessage, dateRegexPattern;

    currentDateTimeLocal = moment().utc().format('HH:mm:ssZ Do MMM YYYY');
    currentDate = moment().utc().format('Do MMM YYYY');
    actualMsg = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
      <testRootElement xmlns="http://www.testing.com/integration/event">
        <dateElement>` + currentDateTimeLocal + `</dateElement>
      </testRootElement>`;
    dateRegexPattern = /\d\d:\d\d:\d\d\+\d\d:\d\d utc-timezone/;
    expectedMessage = [
      {path: 'testRootElement.dateElement', equals: dateRegexPattern, dateFormat: 'Do MMM YYYY'}
    ];

    var result = messageCheckr({
      type: 'jms',
      verbose: true,
      actualMsg: actualMsg,
      expectedMsg: expectedMessage,
      expectedRootElement: 'testRootElement'
    });

    assert.equal(result.allChecksPassed, true);
    assert.deepEqual(result.checks[1], {
      actual: currentDateTimeLocal,
      expected: {equals: dateRegexPattern, dateFormat: 'Do MMM YYYY'},
      target: {path: 'testRootElement.dateElement'},
      description: 'Check actual value ' + currentDateTimeLocal + ' matches date/regex pattern ' + dateRegexPattern.toString().replace('utc-timezone', currentDate),
      pass: true
    });
  });

  it('should report a match where the actual value matches the expected value (local time in the format - Mo/YYYY)', function () {
    var currentDateTimeLocal, currentDate, actualMsg, expectedMessage, dateRegexPattern;

    currentDateTimeLocal = moment().format('Mo/YYYY');
    currentDate = moment().format('Mo\/YYYY');
    actualMsg = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
      <testRootElement xmlns="http://www.testing.com/integration/event">
        <dateElement>` + currentDateTimeLocal + `</dateElement>
      </testRootElement>`;
    dateRegexPattern = /local-timezone/;
    expectedMessage = [
      {path: 'testRootElement.dateElement', equals: dateRegexPattern, dateFormat: 'Mo/YYYY'}
    ];

    var result = messageCheckr({
      type: 'jms',
      verbose: true,
      actualMsg: actualMsg,
      expectedMsg: expectedMessage,
      expectedRootElement: 'testRootElement'
    });

    assert.equal(result.allChecksPassed, true);
    assert.deepEqual(result.checks[1], {
      actual: currentDateTimeLocal,
      expected: {equals: dateRegexPattern, dateFormat: 'Mo/YYYY'},
      target: {path: 'testRootElement.dateElement'},
      description: 'Check actual value ' + currentDateTimeLocal + ' matches date/regex pattern ' + '/' + dateRegexPattern.toString().replace('local-timezone', currentDate).slice(1, -1).replace(/\//g, "\\/") + '/',
      pass: true
    });
  });

  it('should report a match where the actual value matches the expected value (utc time in the format - Mo/YYYY)', function () {
    var currentDateTimeLocal, currentDate, actualMsg, expectedMessage, dateRegexPattern;

    currentDateTimeLocal = moment().utc().format('Mo/YYYY');
    currentDate = moment().format('Mo\/YYYY');
    actualMsg = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
      <testRootElement xmlns="http://www.testing.com/integration/event">
        <dateElement>` + currentDateTimeLocal + `</dateElement>
      </testRootElement>`;
    dateRegexPattern = /utc-timezone/;
    expectedMessage = [
      {path: 'testRootElement.dateElement', equals: dateRegexPattern, dateFormat: 'Mo/YYYY'}
    ];

    var result = messageCheckr({
      type: 'jms',
      verbose: true,
      actualMsg: actualMsg,
      expectedMsg: expectedMessage,
      expectedRootElement: 'testRootElement'
    });

    assert.equal(result.allChecksPassed, true);
    assert.deepEqual(result.checks[1], {
      actual: currentDateTimeLocal,
      expected: {equals: dateRegexPattern, dateFormat: 'Mo/YYYY'},
      target: {path: 'testRootElement.dateElement'},
      description: 'Check actual value ' + currentDateTimeLocal + ' matches date/regex pattern ' + '/' + dateRegexPattern.toString().replace('utc-timezone', currentDate).slice(1, -1).replace(/\//g, "\\/") + '/',
      pass: true
    });
  });

  it('should report a match where the actual value matches the expected value (local time in the format - MMMM/YYYY)', function () {
    var currentDateTimeLocal, currentDate, actualMsg, expectedMessage, dateRegexPattern;

    currentDateTimeLocal = moment().format('MMMM/YYYY');
    currentDate = moment().format('MMMM/YYYY');
    actualMsg = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
      <testRootElement xmlns="http://www.testing.com/integration/event">
        <dateElement>` + currentDateTimeLocal + `</dateElement>
      </testRootElement>`;
    dateRegexPattern = /local-timezone/;
    expectedMessage = [
      {path: 'testRootElement.dateElement', equals: dateRegexPattern, dateFormat: 'MMMM/YYYY'}
    ];

    var result = messageCheckr({
      type: 'jms',
      verbose: true,
      actualMsg: actualMsg,
      expectedMsg: expectedMessage,
      expectedRootElement: 'testRootElement'
    });

    assert.equal(result.allChecksPassed, true);
    assert.deepEqual(result.checks[1], {
      actual: currentDateTimeLocal,
      expected: {equals: dateRegexPattern, dateFormat: 'MMMM/YYYY'},
      target: {path: 'testRootElement.dateElement'},
      description: 'Check actual value ' + currentDateTimeLocal + ' matches date/regex pattern ' + '/' + dateRegexPattern.toString().replace('local-timezone', currentDate).slice(1, -1).replace(/\//g, "\\/") + '/',
      pass: true
    });
  });

  it('should report a match where the actual value matches the expected value (utc time in the format - MMMM/YYYY)', function () {
    var currentDateTimeLocal, currentDate, actualMsg, expectedMessage, dateRegexPattern;

    currentDateTimeLocal = moment().utc().format('MMMM/YYYY');
    currentDate = moment().format('MMMM/YYYY');
    actualMsg = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
      <testRootElement xmlns="http://www.testing.com/integration/event">
        <dateElement>` + currentDateTimeLocal + `</dateElement>
      </testRootElement>`;
    dateRegexPattern = /utc-timezone/;
    expectedMessage = [
      {path: 'testRootElement.dateElement', equals: dateRegexPattern, dateFormat: 'MMMM/YYYY'}
    ];

    var result = messageCheckr({
      type: 'jms',
      verbose: true,
      actualMsg: actualMsg,
      expectedMsg: expectedMessage,
      expectedRootElement: 'testRootElement'
    });

    assert.equal(result.allChecksPassed, true);
    assert.deepEqual(result.checks[1], {
      actual: currentDateTimeLocal,
      expected: {equals: dateRegexPattern, dateFormat: 'MMMM/YYYY'},
      target: {path: 'testRootElement.dateElement'},
      description: 'Check actual value ' + currentDateTimeLocal + ' matches date/regex pattern ' + '/' + dateRegexPattern.toString().replace('utc-timezone', currentDate).slice(1, -1).replace(/\//g, "\\/") + '/',
      pass: true
    });
  });
});