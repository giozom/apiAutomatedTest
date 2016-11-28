var moment = require('moment');

describe('readme tests', function () {

  describe('jms example', function () {
    var actualMsg =
      `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
       <testRootElement xmlns="http://www.testing.com/integration/event">
          <elementOne>hello</elementOne>
          <anotherElement>
            <elementTwo>123</elementTwo>
          </anotherElement>
       </testRootElement>`;

    it('should work', function () {
      var expectedMessage = [
        {path: 'testRootElement', attribute: 'xmlns', equals: 'http://www.testing.com/integration/event'},
        {path: 'testRootElement.elementOne', equals: 'hello'},
        {path: 'testRootElement.anotherElement.elementTwo', equals: '{integer}'}
      ];

      var result = messageCheckr({
        type: 'jms',
        verbose: true,
        actualMsg: actualMsg,
        expectedMsg: expectedMessage,
        expectedRootElement: 'testRootElement'
      });

      assert.equal(result.allChecksPassed, true);
    });
  });

  describe('soap example', function () {
    var actualMsg = `
    <soap-env:Envelope xmlns:soap-env="http://schemas.xmlsoap.org/soap/envelope/">
      <soap-env:Header/>
      <soap-env:Body>
        <m:elementOne>hello</m:elementOne>
      </soap-env:Body>
    </soap-env:Envelope>`;

    it('should work', function () {
      var expectedMessage = [
        {path: 'SOAP-ENV:Envelope', attribute: 'xmlns:SOAP-ENV', equals: 'http://schemas.xmlsoap.org/soap/envelope/'},
        {path: 'SOAP-ENV:ENVELOPE.SOAP-ENV:Body.elementOne', equals: 'hello'}
      ];

      var result = messageCheckr({
        type: 'soap',
        verbose: true,
        actualMsg: actualMsg,
        expectedMsg: expectedMessage
      });

      assert.equal(result.allChecksPassed, true);
    });
  });


  describe('position delimited example', function () {
    var actualMsg = 'start of messageNext part of message123456.10End of message';

    it('should work', function () {
      var expectedMessage = [
        {begin: 0,  end: 15, equals: 'start of message'},
        {begin: 16, end: 35, contains: 'part'},
        {begin: 36, end: 44, equals: 123456.10},
        {begin: 36, end: 44, equals: '{number(2)}'},
        {begin: 45, end: 58, equals: / of /}
      ];

      var result = messageCheckr({
        type: 'position',
        verbose: true,
        actualMsg: actualMsg,
        expectedMsg: expectedMessage
      });

      assert.equal(result.allChecksPassed, true, JSON.stringify(result.checks));
    });
  });


  describe('expectedMessage Types', function () {

    it("{path: 'path.to.element', equals: operator - see section Operators')", function () {

      var actualMessage =
        `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
        <testRootElement xmlns="http://www.testing.com/integration/event">
          <elementOne>hello</elementOne>
        </testRootElement>`;

      var expectedMessage = [
        {path: 'testRootElement.elementOne', equals: 'hello'}
      ];

      var result = messageCheckr({
        type: 'jms',
        verbose: true,
        actualMsg: actualMessage,
        expectedMsg: expectedMessage,
        expectedRootElement: 'testRootElement'
      });

      assert.equal(result.allChecksPassed, true);

      var expectedMessage = [
        {path: 'testRootElement.elementOne', equals: /^hel/}
      ];

      result = messageCheckr({
        type: 'jms',
        verbose: true,
        actualMsg: actualMessage,
        expectedMsg: expectedMessage,
        expectedRootElement: 'testRootElement'
      });

      assert.equal(result.allChecksPassed, true);
    });

    it("{path: 'path.to.element', contains: 'string' or integer}", function () {
      var actualMessage =
        `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
          <testRootElement xmlns="http://www.testing.com/integration/event">
            <elementOne>h3llo mr howl</elementOne>
          </testRootElement>`;

      var expectedMessage = [
        {path: 'testRootElement.elementOne', contains: 'howl'}
      ];

      var result = messageCheckr({
        type: 'jms',
        verbose: true,
        actualMsg: actualMessage,
        expectedMsg: expectedMessage,
        expectedRootElement: 'testRootElement'
      });

      assert.equal(result.allChecksPassed, true);

      var expectedMessage = [
        {path: 'testRootElement.elementOne', contains: 3}
      ];

      result = messageCheckr({
        type: 'jms',
        verbose: true,
        actualMsg: actualMessage,
        expectedMsg: expectedMessage,
        expectedRootElement: 'testRootElement'
      });

      assert.equal(result.allChecksPassed, true);
    });

    it("{path: 'path.to.element', attribute: 'attribute name', contains: 'string' or integer}", function () {

      var actualMessage =
        `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
          <testRootElement xmlns="http://www.testing.com/integration/event">
            <elementOne attribute1="brilliant name for an attribute" attribute2="123456">hello</elementOne>
          </testRootElement>`;

      var expectedMessage = [
        {path: 'testRootElement.elementOne', attribute: 'attribute1', contains: 'brilliant'}
      ];

      var result = messageCheckr({
        type: 'jms',
        verbose: true,
        actualMsg: actualMessage,
        expectedMsg: expectedMessage,
        expectedRootElement: 'testRootElement'
      });

      assert.equal(result.allChecksPassed, true);

      var expectedMessage = [
        {path: 'testRootElement.elementOne', attribute: 'attribute2', contains: 345}
      ];

      result = messageCheckr({
        type: 'jms',
        verbose: true,
        actualMsg: actualMessage,
        expectedMsg: expectedMessage,
        expectedRootElement: 'testRootElement'
      });

      assert.equal(result.allChecksPassed, true);
    });

    it("{path: 'path.to.element', attribute: 'attribute name', equals: operator - see section Operators}", function () {
      var actualMessage =
        `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
        <testRootElement xmlns="http://www.testing.com/integration/event">
          <elementOne attribute1="123456">hello</elementOne>
        </testRootElement>`;

      var expectedMessage = [
        {path: 'testRootElement.elementOne', attribute: 'attribute1', equals: '{integer}'}
      ];

      var result = messageCheckr({
        type: 'jms',
        verbose: true,
        actualMsg: actualMessage,
        expectedMsg: expectedMessage,
        expectedRootElement: 'testRootElement'
      });

      assert.equal(result.allChecksPassed, true);

      expectedMessage = [
        {path: 'testRootElement.elementOne', attribute: 'attribute1', equals: 123456}
      ];

      var result = messageCheckr({
        type: 'jms',
        verbose: true,
        actualMsg: actualMessage,
        expectedMsg: expectedMessage,
        expectedRootElement: 'testRootElement'
      });

      assert.equal(result.allChecksPassed, true);

      expectedMessage = [
        {path: 'testRootElement.elementOne', attribute: 'attribute1', equals: '123456'}
      ];

      result = messageCheckr({
        type: 'jms',
        verbose: true,
        actualMsg: actualMessage,
        expectedMsg: expectedMessage,
        expectedRootElement: 'testRootElement'
      });

      assert.equal(result.allChecksPassed, true);
    });

    it("{path: 'path.to.element', pathShouldNotExist: true}", function () {

      var actualMessage =
        `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
         <testRootElement xmlns="http://www.testing.com/integration/event">
         <elementOne attribute1="brilliant name for an attribute" attribute2="123456">hello</elementOne>
         </testRootElement>`;

      var expectedMessage = [
        {path: 'testRootElement.elementTwo', pathShouldNotExist: true}
      ];

      var result = messageCheckr({
        type: 'jms',
        verbose: true,
        actualMsg: actualMessage,
        expectedMsg: expectedMessage,
        expectedRootElement: 'testRootElement'
      });

      assert.equal(result.allChecksPassed, true);
    });

    it("{path: 'path.to.element', equals: /regex containing utc-timezone or local-timezone/, dateFormat: 'see section Date Format'}", function () {

      var localDate = moment().format('YYYY-MM-DD');
      var actualMessage =
        `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
        <testRootElement xmlns="http://www.testing.com/integration/event">
        <elementOne>` + localDate + `T18:39:00.896+11:00</elementOne>
        </testRootElement>`;

      var expectedMessage = [
        {path: 'testRootElement.elementOne', equals: /local-timezoneT\d\d:\d\d:\d\d\.\d\d\d\+\d\d:\d\d/, dateFormat: 'YYYY-MM-DD'}
      ];

      var result = messageCheckr({
        type: 'jms',
        verbose: true,
        actualMsg: actualMessage,
        expectedMsg: expectedMessage,
        expectedRootElement: 'testRootElement'
      });

      assert.equal(result.allChecksPassed, true);

      var utcDate = moment().utc().format('MMMM YYYY');

      var actualMessage =
        `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
          <testRootElement xmlns="http://www.testing.com/integration/event">
          <elementOne>T18:39:00.896+11:00 ` + utcDate + `</elementOne>
          </testRootElement>`;

      expectedMessage = [
        {path: 'testRootElement.elementOne', equals: /T\d\d:\d\d:\d\d\.\d\d\d\+\d\d:\d\d utc-timezone/, dateFormat: 'MMMM YYYY'}
      ];

      result = messageCheckr({
        type: 'jms',
        verbose: true,
        actualMsg: actualMessage,
        expectedMsg: expectedMessage,
        expectedRootElement: 'testRootElement'
      });

      assert.equal(result.allChecksPassed, true);
    });

    it("{path: 'path.to.element', attribute: 'attribute name', equals: /regex containing utc-timezone or local-timezone/, dateFormat: 'see section Date Format'}", function () {

      var localDate = moment().format('YYYY-MM-DD');
      var actualMessage =
        `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
        <testRootElement xmlns="http://www.testing.com/integration/event">
          <elementOne attributeContainingDateTimestamp="` + localDate + `T18:39:00.896+11:00">hello</elementOne>
        </testRootElement>`;

      var expectedMessage = [
        {path: 'testRootElement.elementOne', attribute: 'attributeContainingDateTimestamp', equals: /local-timezoneT\d\d:\d\d:\d\d\.\d\d\d\+\d\d:\d\d/, dateFormat: 'YYYY-MM-DD'}
      ];

      var result = messageCheckr({
        type: 'jms',
        verbose: true,
        actualMsg: actualMessage,
        expectedMsg: expectedMessage,
        expectedRootElement: 'testRootElement'
      });

      assert.equal(result.allChecksPassed, true);

      var utcDate = moment().format('MMMM YYYY');
      actualMessage =
        `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
        <testRootElement xmlns="http://www.testing.com/integration/event">
          <elementOne attributeContainingDateTimestamp="T18:39:00.896+11:00 ` + utcDate + `">hello</elementOne>
        </testRootElement>`;

      expectedMessage = [
        {path: 'testRootElement.elementOne', attribute: 'attributeContainingDateTimestamp', equals: /T\d\d:\d\d:\d\d\.\d\d\d\+\d\d:\d\d utc-timezone/, dateFormat: 'MMMM YYYY'}
      ];

      result = messageCheckr({
        type: 'jms',
        verbose: true,
        actualMsg: actualMessage,
        expectedMsg: expectedMessage,
        expectedRootElement: 'testRootElement'
      });

      assert.equal(result.allChecksPassed, true);
    });

    it("{repeatingGroup: {path: 'path to element containing repeating group', repeater: 'repeating group name', number: integer - occurrence}, path: 'element name', equals: operator - see section Operators}", function () {

      var actualMessage =
        `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
           <testRootElement xmlns="http://www.testing.com/integration/event">
            <elementOne>
              <thingContainingRepeatingGroups>
                <RepeatingGroup>
                  <fieldOneOfRepeatingGroup>10001</fieldOneOfRepeatingGroup>
                  <fieldTwoOfRepeatingGroup>hello</fieldTwoOfRepeatingGroup>
                </RepeatingGroup>
                <RepeatingGroup>
                  <fieldOneOfRepeatingGroup>10002</fieldOneOfRepeatingGroup>
                  <fieldTwoOfRepeatingGroup>goodbye</fieldTwoOfRepeatingGroup>
                </RepeatingGroup>
              </thingContainingRepeatingGroups>
            </elementOne>
          </testRootElement>`;

      var expectedMessage = [
        {repeatingGroup: {path: 'testRootElement.elementOne.thingContainingRepeatingGroups', repeater: 'RepeatingGroup', number: 1}, path: 'fieldOneOfRepeatingGroup', equals: 10001},
        {repeatingGroup: {path: 'testRootElement.elementOne.thingContainingRepeatingGroups', repeater: 'RepeatingGroup', number: 1}, path: 'fieldTwoOfRepeatingGroup', equals: 'hello'},
        {repeatingGroup: {path: 'testRootElement.elementOne.thingContainingRepeatingGroups', repeater: 'RepeatingGroup', number: 2}, path: 'fieldOneOfRepeatingGroup', equals: '{integer}'},
        {repeatingGroup: {path: 'testRootElement.elementOne.thingContainingRepeatingGroups', repeater: 'RepeatingGroup', number: 2}, path: 'fieldTwoOfRepeatingGroup', equals: '{alpha}'}
      ];

      var result = messageCheckr({
        type: 'jms',
        verbose: true,
        actualMsg: actualMessage,
        expectedMsg: expectedMessage,
        expectedRootElement: 'testRootElement'
      });

      assert.equal(result.allChecksPassed, true);
    });

    it("{repeatingGroup: {path: 'path to element containing repeating group', repeater: 'repeating group name', number: integer - occurrence}, path: 'element name', equals: /regex containing utc-timezone or local-timezone/, dateFormat: 'see section Date Format'}", function () {

      var currentLocalDate = moment().format('YYYY-MM-DD');
      var currentUtcDate = moment().utc().format('DD-MM-YYYY');

      var actualMessage =
        `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
        <testRootElement xmlns="http://www.testing.com/integration/event">
        <elementOne>
          <thingContainingRepeatingGroups>
            <RepeatingGroup>
              <fieldOneOfRepeatingGroup>` + currentLocalDate + `T18:39:00.896+11:00</fieldOneOfRepeatingGroup>
            </RepeatingGroup>
            <RepeatingGroup>
              <fieldOneOfRepeatingGroup>T18:39:00.896+11:00 ` + currentUtcDate + `</fieldOneOfRepeatingGroup>
            </RepeatingGroup>
          </thingContainingRepeatingGroups>
        </elementOne>
        </testRootElement>`;

      var expectedMessage = [
        {repeatingGroup: {path: 'testRootElement.elementOne.thingContainingRepeatingGroups', repeater: 'RepeatingGroup', number: 1}, path: 'fieldOneOfRepeatingGroup', equals: /local-timezoneT\d\d:\d\d:\d\d\.\d\d\d\+\d\d:\d\d/, dateFormat: 'YYYY-MM-DD'},
        {repeatingGroup: {path: 'testRootElement.elementOne.thingContainingRepeatingGroups', repeater: 'RepeatingGroup', number: 2}, path: 'fieldOneOfRepeatingGroup', equals: /T\d\d:\d\d:\d\d\.\d\d\d\+\d\d:\d\d utc-timezone/, dateFormat: 'DD-MM-YYYY'}
      ];

      var result = messageCheckr({
        type: 'jms',
        verbose: true,
        actualMsg: actualMessage,
        expectedMsg: expectedMessage,
        expectedRootElement: 'testRootElement'
      });

      assert.equal(result.allChecksPassed, true);
    });

    it("{repeatingGroup: {path: 'path to element containing repeating group', repeater: 'repeating group name', number: integer - occurrence}, path: 'element name', contains: 'string' or integer}", function () {
      var actualMessage = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
        <testRootElement xmlns="http://www.testing.com/integration/event">
          <elementOne>
            <thingContainingRepeatingGroups>
              <RepeatingGroup>
                <fieldOneOfRepeatingGroup>10001</fieldOneOfRepeatingGroup>
              </RepeatingGroup>
              <RepeatingGroup>
                <fieldOneOfRepeatingGroup>hello mr howl</fieldOneOfRepeatingGroup>
              </RepeatingGroup>
            </thingContainingRepeatingGroups>
          </elementOne>
        </testRootElement>`;

      var expectedMessage = [
        {repeatingGroup: {path: 'testRootElement.elementOne.thingContainingRepeatingGroups', repeater: 'RepeatingGroup', number: 1}, path: 'fieldOneOfRepeatingGroup', contains: 100},
        {repeatingGroup: {path: 'testRootElement.elementOne.thingContainingRepeatingGroups', repeater: 'RepeatingGroup', number: 2}, path: 'fieldOneOfRepeatingGroup', contains: 'howl'}
      ];

      var result = messageCheckr({
        type: 'jms',
        verbose: true,
        actualMsg: actualMessage,
        expectedMsg: expectedMessage,
        expectedRootElement: 'testRootElement'
      });

      assert.equal(result.allChecksPassed, true);
    });

    it("{repeatingGroup: {path: 'path to element containing repeating group', repeater: 'repeating group name', number: integer - occurrence}, path: 'element name', pathShouldNotExist: true}", function () {
      var actualMessage =
        `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
        <testRootElement xmlns="http://www.testing.com/integration/event">
        <elementOne>
          <thingContainingRepeatingGroups>
            <RepeatingGroup>
              <fieldOneOfRepeatingGroup>10001</fieldOneOfRepeatingGroup>
            </RepeatingGroup>
            <RepeatingGroup>
              <fieldOneOfRepeatingGroup>hello mr howl</fieldOneOfRepeatingGroup>
            </RepeatingGroup>
          </thingContainingRepeatingGroups>
        </elementOne>
        </testRootElement>`;

      var expectedMessage = [
        {repeatingGroup: {path: 'testRootElement.elementOne.thingContainingRepeatingGroups', repeater: 'RepeatingGroup', number: 1}, path: 'fieldTwoOfRepeatingGroup', pathShouldNotExist: true}
      ];

      var result = messageCheckr({
        type: 'jms',
        verbose: true,
        actualMsg: actualMessage,
        expectedMsg: expectedMessage,
        expectedRootElement: 'testRootElement'
      });

      assert.equal(result.allChecksPassed, true);
    });

    it("{repeatingGroup: {path: 'path to element containing repeating group', repeater: 'repeating group name', number: integer - occurrence}, path: 'element name', attribute: 'attribute name', equals: operator - see section Operators}", function () {
      var actualMessage = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
        <testRootElement xmlns="http://www.testing.com/integration/event">
          <elementOne>
            <thingContainingRepeatingGroups>
              <RepeatingGroup>
                <fieldOneOfRepeatingGroup testAttribute1="toffee">not interested in this value</fieldOneOfRepeatingGroup>
                <fieldTwoOfRepeatingGroup testAttribute2="chocolate">not interested in this value</fieldTwoOfRepeatingGroup>
              </RepeatingGroup>
              <RepeatingGroup>
                <fieldOneOfRepeatingGroup testAttribute1="tea">not interested in this value</fieldOneOfRepeatingGroup>
                <fieldTwoOfRepeatingGroup testAttribute2="coffee">not interested in this value</fieldTwoOfRepeatingGroup>
              </RepeatingGroup>
            </thingContainingRepeatingGroups>
          </elementOne>
        </testRootElement>`;

      var expectedMessage = [
        {repeatingGroup: {path: 'testRootElement.elementOne.thingContainingRepeatingGroups', repeater: 'RepeatingGroup', number: 1}, path: 'fieldOneOfRepeatingGroup', attribute: 'testAttribute1', equals: 'toffee'},
        {repeatingGroup: {path: 'testRootElement.elementOne.thingContainingRepeatingGroups', repeater: 'RepeatingGroup', number: 1}, path: 'fieldTwoOfRepeatingGroup', attribute: 'testAttribute2', equals: 'chocolate'},
        {repeatingGroup: {path: 'testRootElement.elementOne.thingContainingRepeatingGroups', repeater: 'RepeatingGroup', number: 2}, path: 'fieldOneOfRepeatingGroup', attribute: 'testAttribute1', equals: 'tea'},
        {repeatingGroup: {path: 'testRootElement.elementOne.thingContainingRepeatingGroups', repeater: 'RepeatingGroup', number: 2}, path: 'fieldTwoOfRepeatingGroup', attribute: 'testAttribute2', equals: 'coffee'}
      ];

      var result = messageCheckr({
        type: 'jms',
        verbose: true,
        actualMsg: actualMessage,
        expectedMsg: expectedMessage,
        expectedRootElement: 'testRootElement'
      });

      assert.equal(result.allChecksPassed, true);
    });

    it("{repeatingGroup: {path: 'path to element containing repeating group', repeater: 'repeating group name', number: integer - occurrence}, path: 'element name', attribute: 'attribute name', contains: 'string' or integer}", function () {

      var actualMessage =
        `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
         <testRootElement xmlns="http://www.testing.com/integration/event">
          <elementOne>
            <thingContainingRepeatingGroups>
              <RepeatingGroup>
                  <fieldOneOfRepeatingGroup testAttribute1="toffee">not interested in this value</fieldOneOfRepeatingGroup>
                  <fieldTwoOfRepeatingGroup testAttribute2="123">not interested in this value</fieldTwoOfRepeatingGroup>
              </RepeatingGroup>
              <RepeatingGroup>
                  <fieldOneOfRepeatingGroup testAttribute1="tea">not interested in this value</fieldOneOfRepeatingGroup>
                  <fieldTwoOfRepeatingGroup testAttribute2="123">not interested in this value</fieldTwoOfRepeatingGroup>
              </RepeatingGroup>
            </thingContainingRepeatingGroups>
          </elementOne>
        </testRootElement>`;

      var expectedMessage = [
        {repeatingGroup: {path: 'testRootElement.elementOne.thingContainingRepeatingGroups', repeater: 'RepeatingGroup', number: 1}, path: 'fieldOneOfRepeatingGroup', attribute: 'testAttribute1', contains: 'toffee'},
        {repeatingGroup: {path: 'testRootElement.elementOne.thingContainingRepeatingGroups', repeater: 'RepeatingGroup', number: 1}, path: 'fieldTwoOfRepeatingGroup', attribute: 'testAttribute2', contains: 123},
        {repeatingGroup: {path: 'testRootElement.elementOne.thingContainingRepeatingGroups', repeater: 'RepeatingGroup', number: 2}, path: 'fieldOneOfRepeatingGroup', attribute: 'testAttribute1', contains: 'ea'},
        {repeatingGroup: {path: 'testRootElement.elementOne.thingContainingRepeatingGroups', repeater: 'RepeatingGroup', number: 2}, path: 'fieldTwoOfRepeatingGroup', attribute: 'testAttribute2', contains: 2}
      ];

      var result = messageCheckr({
        type: 'jms',
        verbose: true,
        actualMsg: actualMessage,
        expectedMsg: expectedMessage,
        expectedRootElement: 'testRootElement'
      });

      assert.equal(result.allChecksPassed, true);
    });

    it("{repeatingGroup: {path: 'path to element containing repeating group', repeater: 'repeating group name', number: integer - occurrence}, path: 'element name', attribute: 'attribute name', equals: /regex containing utc-timezone or local-timezone/, dateFormat: 'see section Date Format'}", function () {

      var localDate = moment().format('YYYY-MM-DD');
      var utcDate = moment().utc().format('DD-MM-YYYY');

      var actualMessage =
        `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
        <testRootElement xmlns="http://www.testing.com/integration/event">
        <elementOne>
          <thingContainingRepeatingGroups>
            <RepeatingGroup>
              <fieldOneOfRepeatingGroup testAttribute1="` + localDate + `T18:39:00.896+11:00">not interested in this value</fieldOneOfRepeatingGroup>
            </RepeatingGroup>
            <RepeatingGroup>
              <fieldOneOfRepeatingGroup testAttribute1="T18:39:00.896+11:00 ` + utcDate + `">not interested in this value</fieldOneOfRepeatingGroup>
            </RepeatingGroup>
          </thingContainingRepeatingGroups>
        </elementOne>
      </testRootElement>`;

      var expectedMessage = [
        {repeatingGroup: {path: 'testRootElement.elementOne.thingContainingRepeatingGroups', repeater: 'RepeatingGroup', number: 1}, path: 'fieldOneOfRepeatingGroup', attribute: 'testAttribute1', equals: /local-timezoneT\d\d:\d\d:\d\d\.\d\d\d\+\d\d:\d\d/, dateFormat: 'YYYY-MM-DD'},
        {repeatingGroup: {path: 'testRootElement.elementOne.thingContainingRepeatingGroups', repeater: 'RepeatingGroup', number: 2}, path: 'fieldOneOfRepeatingGroup', attribute: 'testAttribute1', equals: /T\d\d:\d\d:\d\d\.\d\d\d\+\d\d:\d\d utc-timezone/, dateFormat: 'DD-MM-YYYY'}
      ];

      var result = messageCheckr({
        type: 'jms',
        verbose: true,
        actualMsg: actualMessage,
        expectedMsg: expectedMessage,
        expectedRootElement: 'testRootElement'
      });

      assert.equal(result.allChecksPassed, true);
    });

    it("{parentPath: 'path to parent of child element', element: 'element name',  elementPosition: integer > 0, equals: operator - see section Operators}", function () {
      var actualMessage =
        `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
          <testRootElement xmlns="http://www.testing.com/integration/event">
            <elementOne>hello</elementOne>
            <elementTwo>its</elementTwo>
            <elementOne>me</elementOne>
            <elementTwo>ben</elementTwo>
          </testRootElement>`;

      var expectedMessage = [
        {parentPath: 'testRootElement', element: 'elementOne', elementPosition: 3, equals: 'me'}
      ];

      var result = messageCheckr({
        type: 'jms',
        verbose: true,
        actualMsg: actualMessage,
        expectedMsg: expectedMessage,
        expectedRootElement: 'testRootElement'
      });

      assert.equal(result.allChecksPassed, true);

      actualMessage =
        `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
        <testRootElement xmlns="http://www.testing.com/integration/event">
          <anotherElement>
            <elementOne>hello</elementOne>
            <elementTwo>its</elementTwo>
            <elementOne>me</elementOne>
            <elementTwo>ben</elementTwo>
          </anotherElement>
        </testRootElement>`;

      expectedMessage = [
        {parentPath: 'testRootElement.anotherElement', element: 'elementOne', elementPosition: 3, equals: 'me'}
      ];

      result = messageCheckr({
        type: 'jms',
        verbose: true,
        actualMsg: actualMessage,
        expectedMsg: expectedMessage,
        expectedRootElement: 'testRootElement'
      });

      assert.equal(result.allChecksPassed, true);
    });

    it("{parentPath: 'path to parent of child element', element: 'element name', elementPosition: integer > 0, equals: /regex containing utc-timezone or local-timezone/, dateFormat: 'see section Date Format'}", function () {

      var localDate = moment().format('DD-MM-YYYY');

      var actualMessage =
        `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
       <testRootElement xmlns="http://www.testing.com/integration/event">
         <elementOne>YYYY-MM-DDT18:39:00.896+11:00</elementOne>
         <elementTwo>YYYY-MM-DDT18:39:00.896+11:00</elementTwo>
         <elementOne>` + localDate + `T18:39:00.896+11:00</elementOne>
         <elementTwo>YYYY-MM-DDT18:39:00.896+11:00</elementTwo>
       </testRootElement>`;

      var expectedMessage = [
        {parentPath: 'testRootElement', element: 'elementOne', elementPosition: 3, equals: /local-timezoneT\d\d:\d\d:\d\d\.\d\d\d\+\d\d:\d\d/, dateFormat: 'DD-MM-YYYY'}
      ];

      var result = messageCheckr({
        type: 'jms',
        verbose: true,
        actualMsg: actualMessage,
        expectedMsg: expectedMessage,
        expectedRootElement: 'testRootElement'
      });

      assert.equal(result.allChecksPassed, true);
    });

    it("{parentPath: 'path to parent of child element', element: 'element name', elementPosition: integer > 0, contains: 'string' or integer}", function () {

      var actualMessage =
        `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
        <testRootElement xmlns="http://www.testing.com/integration/event">
          <elementOne>hello</elementOne>
          <elementTwo>its</elementTwo>
          <elementOne>me</elementOne>
          <elementTwo>ben</elementTwo>
        </testRootElement>`;

      var expectedMessage = [
        {parentPath: 'testRootElement', element: 'elementOne', elementPosition: 3, contains: 'me'},
        {parentPath: 'testRootElement', element: 'elementTwo', elementPosition: 4, contains: 'be'}
      ];

      var result = messageCheckr({
        type: 'jms',
        verbose: true,
        actualMsg: actualMessage,
        expectedMsg: expectedMessage,
        expectedRootElement: 'testRootElement'
      });

      assert.equal(result.allChecksPassed, true);
    });

    it("{parentPath: 'path to parent of child element', element: 'element name', elementPosition: integer > 0, attribute: 'attribute name', equals: operator - see section Operators}", function () {

      var actualMessage =
        `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
        <testRootElement xmlns="http://www.testing.com/integration/event">
          <elementOne attribute1="123">hello</elementOne>
          <elementTwo attribute1="1234">its</elementTwo>
          <elementOne attribute1="12345">me</elementOne>
          <elementTwo attribute1="123456">ben</elementTwo>
        </testRootElement>`;

      var expectedMessage = [
        {parentPath: 'testRootElement', element: 'elementOne', elementPosition: 3, attribute: 'attribute1', equals: 12345}
      ];

      var result = messageCheckr({
        type: 'jms',
        verbose: true,
        actualMsg: actualMessage,
        expectedMsg: expectedMessage,
        expectedRootElement: 'testRootElement'
      });

      assert.equal(result.allChecksPassed, true);
    });

    it("{parentPath: 'path to parent of child element', element: 'element name', elementPosition: integer > 0, attribute: 'attribute name', equals: /regex containing utc-timezone or local-timezone/, dateFormat: 'see section Date Format'}", function () {
      var localDate = moment().format('DD-MM-YYYY');

      var actualMessage =
        `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
        <testRootElement xmlns="http://www.testing.com/integration/event">
          <elementOne attribute1="YYYY-MM-DDT18:39:00.896+11:00">not interested in this value</elementOne>
          <elementTwo attribute1="YYYY-MM-DDT18:39:00.896+11:00">not interested in this value</elementTwo>
          <elementOne attribute1="` + localDate + `T18:39:00.896+11:00">not interested in this value</elementOne>
          <elementTwo attribute1="YYYY-MM-DDT18:39:00.896+11:00">not interested in this value</elementTwo>
        </testRootElement>`;

      var expectedMessage = [
        {parentPath: 'testRootElement', element: 'elementOne', elementPosition: 3, attribute: 'attribute1', equals: /local-timezoneT\d\d:\d\d:\d\d\.\d\d\d\+\d\d:\d\d/, dateFormat: 'DD-MM-YYYY'}
      ];

      var result = messageCheckr({
        type: 'jms',
        verbose: true,
        actualMsg: actualMessage,
        expectedMsg: expectedMessage,
        expectedRootElement: 'testRootElement'
      });

      assert.equal(result.allChecksPassed, true);
    });

    it("{parentPath: 'path to parent of child element', element: 'element name', elementPosition: integer > 0, attribute: 'attribute name', contains: 'string' or integer}", function () {

      var actualMessage =
        `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
        <testRootElement xmlns="http://www.testing.com/integration/event">
          <elementOne attribute1="123">not interested in this value</elementOne>
          <elementTwo attribute1="1234">not interested in this value</elementTwo>
          <elementOne attribute1="12345">not interested in this value</elementOne>
          <elementTwo attribute1="123456">not interested in this value</elementTwo>
        </testRootElement>`;

      var expectedMessage = [
        {parentPath: 'testRootElement', element: 'elementOne', elementPosition: 3, attribute: 'attribute1', contains: 2345}
      ];

      var result = messageCheckr({
        type: 'jms',
        verbose: true,
        actualMsg: actualMessage,
        expectedMsg: expectedMessage,
        expectedRootElement: 'testRootElement'
      });

      assert.equal(result.allChecksPassed, true);
    });
  });
});

