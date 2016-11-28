var _ = require('lodash'),
  moment = require('moment'),
  validator = require('validator'),
  verificationResults = require('./verificationResults'),
  store = require('./store');

var assertions = {

  verifyMessageComponent: function verifyMessageComponent(messageComponent) {

    if (messageComponent.getExpected().pathShouldNotExist) {
      verificationResults.add(
        {
          pass: !messageComponent.isPathPresent(),
          target: messageComponent.getPrintablePath(),
          description: 'Check path does not exist'
        }
      );
    } else {

      if (!messageComponent.isPathPresent()) {
        verificationResults.add(
          {
            pass: messageComponent.isPathPresent(),
            target: messageComponent.getPrintablePath(),
            description: 'Check path does exist'
          }
        );
      } else {
        var printablePath = messageComponent.getPrintablePath(),
          actualValue = messageComponent.getActualValue();

        if (_.has(messageComponent.getExpected(), 'equals')) {
          var expectedValue = messageComponent.getExpected().equals;

          if(_.isNumber(expectedValue)){
            if (Number.isInteger(expectedValue)) {
              verificationResults.add(
                {
                  pass: parseInt(actualValue) === expectedValue,
                  target: printablePath,
                  actual: parseInt(actualValue),
                  expected: messageComponent.getExpected(),
                  description: 'Check actual value ' + actualValue + ' is equal to ' + expectedValue
                }
              );
            } else if (validator.isDecimal(expectedValue)){
              verificationResults.add(
                {
                  pass: parseFloat(actualValue) === expectedValue,
                  target: printablePath,
                  actual: parseFloat(actualValue),
                  expected: messageComponent.getExpected(),
                  description: 'Check actual value ' + actualValue + ' is equal to ' + expectedValue
                }
              );
            }
          } else if (_.isRegExp(expectedValue)) {
            if (expectedValue.toString().indexOf('local-timezone') != -1) {
              this.timestampCheck(printablePath, expectedValue, actualValue, 'local-timezone', messageComponent.getExpected().dateFormat, messageComponent.getExpected());
            } else if (expectedValue.toString().indexOf('utc-timezone') != -1) {
              this.timestampCheck(printablePath, expectedValue, actualValue, 'utc-timezone', messageComponent.getExpected().dateFormat, messageComponent.getExpected());
            } else {
              this.regexCheck(printablePath, actualValue, expectedValue, messageComponent.getExpected());
            }
          } else if (expectedValue.match(/^\{store\(.*\)}$/) != null) {
            var storeName = expectedValue.match(/\(([^)]+)\)/)[1];
            if (!/^[a-zA-Z]+$/.test(storeName)) {
              throw new Error('Store name \'' + storeName + '\' is only allowed to consist of characters.')
            }
            store.add(storeName, actualValue);
          } else if (expectedValue.match(/^\{matches\([a-zA-Z]*\)}$/) != null) {
            var storeName = expectedValue.match(/\(([^)]+)\)/)[1];
            this.storeCheck(printablePath, storeName, actualValue, messageComponent.getExpected());
          } else if (expectedValue.match(/^\{uuid}$/) != null) {
            this.uuidCheck(printablePath, actualValue);
          } else if (expectedValue.match(/^\{alphanumeric}$/) != null) {
            this.isAlphanumericCheck(printablePath, actualValue);
          } else if (expectedValue.match(/^\{alpha}$/) != null) {
            this.isAlphaCheck(printablePath, actualValue);
          } else if (expectedValue.match(/^\{integer}$/) != null) {
            this.isInteger(printablePath, actualValue);
          } else if (expectedValue.match(/^\{number\(\d+\)}$/) != null) {
            this.isNumber(printablePath, actualValue, parseInt(expectedValue.match(/\d+/)[0]));
          } else if (expectedValue.match(/^\{length\(<\d+\)\}$/) != null) {
            this.lessThanLengthCheck(printablePath, actualValue, parseInt(expectedValue.match(/\d+/)[0]));
          } else if (expectedValue.match(/^\{length\(>\d+\)\}$/) != null) {
            this.greaterThanLengthCheck(printablePath, actualValue, parseInt(expectedValue.match(/\d+/)[0]));
          } else if (expectedValue.match(/^\{length\(\d+\)\}$/) != null) {
            this.equalLengthCheck(printablePath, actualValue, parseInt(expectedValue.match(/\d+/)[0]));
          } else {
            this.equalsCheck(printablePath, actualValue, expectedValue);
          }

        } else if (_.has(messageComponent.getExpected(), 'contains')) {
          this.containsCheck(printablePath, messageComponent.getActualValue(), messageComponent.getExpected().contains, messageComponent.getExpected());
        } else {
          throw new Error('I have not accounted for something, whoops!');
        }
      }
    }
  },

  checkRootElement: function checkRootElement(xmlDocument, expectedRootElement) {
    verificationResults.add(
      {
        pass: xmlDocument.name === expectedRootElement,
        target: expectedRootElement,
        actual: xmlDocument.name,
        expected: expectedRootElement,
        description: 'Check actual root element ' + xmlDocument.name + ' is equal to expected root element ' + expectedRootElement
      }
    );
  },

  equalsCheck: function equalsCheck(path, actualValue, expectedValue) {
    verificationResults.add(
      {
        pass: actualValue === expectedValue,
        target: path,
        actual: actualValue,
        expected: expectedValue,
        description: 'Check actual value ' + actualValue + ' is equal to ' + expectedValue
      }
    );
  },

  containsCheck: function containsCheck(path, actualValue, containsExpectedValue, expected) {
    verificationResults.add(
      {
        pass: actualValue.indexOf(containsExpectedValue) != -1,
        target: path,
        actual: actualValue,
        expected: expected,
        description: 'Check actual value ' + actualValue + ' contains ' + containsExpectedValue
      }
    );
  },

  uuidCheck: function uuidCheck(path, actualValue) {
    verificationResults.add(
      {
        pass: validator.isUUID(actualValue),
        target: path,
        actual: actualValue,
        expected: '{uuid}',
        description: 'Check actual value ' + actualValue + ' is a valid UUID'
      }
    );
  },

  storeCheck: function storeCheck(path, storeName, actualValue, expected) {
    var valuePreviouslyStored = store.get(storeName);

    verificationResults.add(
      {
        pass: valuePreviouslyStored === actualValue,
        target: path,
        actual: actualValue,
        expected: expected,
        description: 'Check actual value ' + actualValue + ' matches value ' + valuePreviouslyStored + ' in {store(' + storeName + ')}'
      }
    );
  },

  isAlphanumericCheck: function isAlphanumericCheck(path, actualValue) {
    verificationResults.add(
      {
        pass: validator.isAlphanumeric(actualValue),
        target: path,
        actual: actualValue,
        expected: '{alphanumeric}',
        description: 'Check actual value ' + actualValue + ' is alphanumeric'
      }
    );
  }
  ,

  isAlphaCheck: function isAlphaCheck(path, actualValue) {
    verificationResults.add(
      {
        pass: validator.isAlpha(actualValue),
        target: path,
        actual: actualValue,
        expected: '{alpha}',
        description: 'Check actual value ' + actualValue + ' is alpha'
      }
    );
  }
  ,

  isInteger: function isInteger(path, actualValue) {
    var descriptionOfCheck = 'Check actual value ' + actualValue + ' is an integer';

    if (Number.isNaN(Number(actualValue))) {
      verificationResults.add(
        {
          pass: false,
          target: path,
          actual: actualValue,
          expected: '{integer}',
          description: descriptionOfCheck
        }
      );
    } else {
      verificationResults.add(
        {
          pass: Number.isInteger(Number.parseFloat(actualValue)),
          target: path,
          actual: actualValue,
          expected: '{integer}',
          description: descriptionOfCheck
        }
      );
    }
  },

  isNumber: function isNumber(path, actualValue, expectedDecimalPlaces) {
    var descriptionOfCheck = 'Check actual value ' + actualValue + ' is a number with ' + expectedDecimalPlaces + ' decimal places';
    var addToVerificationResults = function addToVerificationResults(pass, path, actualValue, expectedDecimalPlaces) {
      verificationResults.add(
        {
          pass: pass,
          target: path,
          actual: actualValue,
          expected: '{number(' + expectedDecimalPlaces + ')}',
          description: descriptionOfCheck
        }
      );
    };

    if (Number.isNaN(Number(actualValue))) {
      addToVerificationResults(false, path, actualValue, expectedDecimalPlaces);
    } else {
      if (validator.isDecimal(actualValue)) {
        if (actualValue.indexOf('.') != -1) {
          var digitsAfterPeriod = actualValue.split('.').length === 1 ? actualValue.split('.')[0].length : actualValue.split('.')[1].length;

          if (digitsAfterPeriod === expectedDecimalPlaces) {
            addToVerificationResults(true, path, actualValue, expectedDecimalPlaces);
          } else {
            addToVerificationResults(false, path, actualValue, expectedDecimalPlaces);
          }
        } else {

          if (0 === expectedDecimalPlaces){
            addToVerificationResults(true, path, actualValue, expectedDecimalPlaces);
          } else{
            addToVerificationResults(false, path, actualValue, expectedDecimalPlaces);
          }
        }
      } else {
        addToVerificationResults(false, path, actualValue, expectedDecimalPlaces);
      }
    }
  },

  lessThanLengthCheck: function lessThanLengthCheck(path, actualValue, expectedLength) {
    var lessThanExpected = actualValue.toString().length < expectedLength;
    verificationResults.add(
      {
        pass: lessThanExpected,
        target: path,
        actual: actualValue,
        expected: '{length(<' + expectedLength + ')}',
        description: 'Check actual value ' + actualValue + ' has a length less than ' + expectedLength
      }
    );
  },

  greaterThanLengthCheck: function greaterThanLengthCheck(path, actualValue, expectedLength) {
    var greaterThanExpected = actualValue.toString().length > expectedLength;
    verificationResults.add(
      {
        pass: greaterThanExpected,
        target: path,
        actual: actualValue,
        expected: '{length(>' + expectedLength + ')}',
        description: 'Check actual value ' + actualValue + ' has a length greater than ' + expectedLength
      }
    );
  },

  equalLengthCheck: function equalLengthCheck(path, actualValue, expectedLength) {
    var equal = actualValue.toString().length === expectedLength;
    verificationResults.add(
      {
        pass: equal,
        target: path,
        actual: actualValue,
        expected: '{length(' + expectedLength + ')}',
        description: 'Check actual value ' + actualValue + ' has a length equal to ' + expectedLength
      }
    );
  },

  regexCheck: function regexCheck(path, actualValue, regexPattern, expected) {
    verificationResults.add(
      {
        pass: regexPattern.test(actualValue),
        target: path,
        actual: actualValue,
        expected: expected,
        description: 'Check actual value ' + actualValue + ' against regex ' + regexPattern.toString()
      }
    );
  },

  timestampCheck: function timestampCheck(path, regexPattern, actualValue, timezone, dateFormat, expected) {
    var currentDate, regexObj;

    if (_.isUndefined(dateFormat)) {
      throw new Error('Expected additional attribute \'dateFormat\' when local-timezone or utc-timezone is present in a regex literal for \'equals\'');
    }

    if (timezone === 'local-timezone') {
      currentDate = moment().format(dateFormat);
    } else if (timezone === 'utc-timezone') {
      currentDate = moment().utc().format(dateFormat);
    } else {
      throw new Error('A valid timezone has not been specified - valid values are \'local-timezone\' and \'utc-timezone\'');
    }

    regexObj = new RegExp(regexPattern.toString().replace(timezone, currentDate).slice(1, -1));
    verificationResults.add(
      {
        pass: regexObj.test(actualValue),
        target: path,
        actual: actualValue,
        expected: expected,
        description: 'Check actual value ' + actualValue + ' matches date/regex pattern ' + regexObj
      }
    );
  }
};

module.exports = assertions;
