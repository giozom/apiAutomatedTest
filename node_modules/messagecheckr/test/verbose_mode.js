describe('verbose mode', function () {

  var actualMsg =
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
       <testRootElement xmlns="http://www.testing.com/integration/event">
          <elementOne>hello</elementOne>
          <anotherElement>
            <elementTwo>123</elementTwo>
          </anotherElement>
       </testRootElement>`;

  var expectedMessage = [
    {path: 'testRootElement', attribute: 'xmlns', equals: 'http://www.testing.com/integration/event'},
    {path: 'testRootElement', attribute: 'xmlns', equals: 'does not equal this'},
    {path: 'testRootElement.elementOne', equals: 'hello'},
    {path: 'testRootElement.elementOne', equals: 'does not equal this'},
    {path: 'testRootElement.anotherElement.elementTwo', equals: '{integer}'},
    {path: 'testRootElement.anotherElement.elementTwo', equals: '{alpha}'}
  ];

  it('messageCheckr should output only failures when the verbose parameter is not supplied', function () {
    var result = messageCheckr({
      type: 'jms',
      actualMsg: actualMsg,
      expectedMsg: expectedMessage,
      expectedRootElement: 'testRootElement'
    });

    assert.deepEqual(result.checks,
      [
        {
          "pass": false,
          "target": {"path": "testRootElement", "attribute": "xmlns"},
          "actual": "http://www.testing.com/integration/event",
          "expected": "does not equal this",
          "description": "Check actual value http://www.testing.com/integration/event is equal to does not equal this"
        },
        {
          "pass": false,
          "target": {"path": "testRootElement.elementOne"},
          "actual": "hello",
          "expected": "does not equal this",
          "description": "Check actual value hello is equal to does not equal this"
        },
        {
          "pass": false,
          "target": {"path": "testRootElement.anotherElement.elementTwo"},
          "actual": "123",
          "expected": "{alpha}",
          "description": "Check actual value 123 is alpha"
        }
      ]);
  });

  it('messageCheckr should output only failures when the verbose parameter = false', function () {
    var result = messageCheckr({
      type: 'jms',
      actualMsg: actualMsg,
      expectedMsg: expectedMessage,
      expectedRootElement: 'testRootElement',
      verbose: false
    });

    assert.deepEqual(result.checks,
      [
        {
          "pass": false,
          "target": {"path": "testRootElement", "attribute": "xmlns"},
          "actual": "http://www.testing.com/integration/event",
          "expected": "does not equal this",
          "description": "Check actual value http://www.testing.com/integration/event is equal to does not equal this"
        },
        {
          "pass": false,
          "target": {"path": "testRootElement.elementOne"},
          "actual": "hello",
          "expected": "does not equal this",
          "description": "Check actual value hello is equal to does not equal this"
        },
        {
          "pass": false,
          "target": {"path": "testRootElement.anotherElement.elementTwo"},
          "actual": "123",
          "expected": "{alpha}",
          "description": "Check actual value 123 is alpha"
        }
      ]);
  });

  it('messageCheckr should output all checks when the verbose parameter = true', function () {

    var result = messageCheckr({
      type: 'jms',
      actualMsg: actualMsg,
      expectedMsg: expectedMessage,
      expectedRootElement: 'testRootElement',
      verbose: true
    });

    assert.deepEqual(result.checks,
      [
        {
          "pass": true,
          "target": "testRootElement",
          "actual": "testRootElement",
          "expected": "testRootElement",
          "description": "Check actual root element testRootElement is equal to expected root element testRootElement"
        },
        {
          "pass": true,
          "target": {"path": "testRootElement", "attribute": "xmlns"},
          "actual": "http://www.testing.com/integration/event",
          "expected": "http://www.testing.com/integration/event",
          "description": "Check actual value http://www.testing.com/integration/event is equal to http://www.testing.com/integration/event"
        },
        {
          "pass": false,
          "target": {"path": "testRootElement", "attribute": "xmlns"},
          "actual": "http://www.testing.com/integration/event",
          "expected": "does not equal this",
          "description": "Check actual value http://www.testing.com/integration/event is equal to does not equal this"
        },
        {
          "pass": true,
          "target": {"path": "testRootElement.elementOne"},
          "actual": "hello",
          "expected": "hello",
          "description": "Check actual value hello is equal to hello"
        },
        {
          "pass": false,
          "target": {"path": "testRootElement.elementOne"},
          "actual": "hello",
          "expected": "does not equal this",
          "description": "Check actual value hello is equal to does not equal this"
        },
        {
          "pass": true,
          "target": {"path": "testRootElement.anotherElement.elementTwo"},
          "actual": "123",
          "expected": "{integer}",
          "description": "Check actual value 123 is an integer"
        },
        {
          "pass": false,
          "target": {"path": "testRootElement.anotherElement.elementTwo"},
          "actual": "123",
          "expected": "{alpha}",
          "description": "Check actual value 123 is alpha"
        }
      ]);
  });
});