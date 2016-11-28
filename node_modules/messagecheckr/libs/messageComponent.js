var messageComponentType = require('./messageComponentType');
var _ = require('lodash');

var messageComponent = function (messageType, expectedMessageComponent, actualMessage) {

  var type, expected, actualValue, printablePath, pathToXmlElement, pathExists;

  var result = validate(messageType, expectedMessageComponent);
  type = result.type;
  expected = result.expected;

  if (messageType === 'xml'){
    pathToXmlElement = getPathToXmlElement(expectedMessageComponent, type, actualMessage);
    pathExists = !_.isUndefined(pathToXmlElement);
  } else {
    pathExists = expectedMessageComponent.end <= actualMessage.length;
  }

  printablePath = determinePrintablePath(expectedMessageComponent);

  if (pathExists) {
    if (messageType === 'xml'){
      actualValue = getValueAtPath(pathToXmlElement, expectedMessageComponent.attribute);
    } else {
      actualValue = actualMessage.substring(expectedMessageComponent.begin, expectedMessageComponent.end+1);
    }
  }

  return {

    isPathPresent: function isPathPresent() {
      return pathExists;
    },

    getActualValue: function getActualValue() {
      return actualValue;
    },

    getExpected: function getExpected() {
      return expected;
    },

    getPrintablePath: function getPrintablePath() {
      return printablePath;
    }
  };
};

module.exports = messageComponent;

function validate(messageType, expectedMessageComponent) {

  if (_.isNull(expectedMessageComponent) ||
    _.isArray(expectedMessageComponent) ||
    _.isString(expectedMessageComponent) ||
    _.isBoolean(expectedMessageComponent) ||
    _.isNumber(expectedMessageComponent) ||
    _.keys(expectedMessageComponent).length === 0) {
    throw new Error('The following expectedMessageComponent is not valid: ' + JSON.stringify(expectedMessageComponent));
  }

  var type = messageComponentType.UNKNOWN,
    expectedMessageComponentKeys = _.keys(expectedMessageComponent).sort(),
    expected;

  if (messageType === 'xml') {

    if (_.has(expectedMessageComponent, 'repeatingGroup') && _.isEqual(_.keys(expectedMessageComponent.repeatingGroup).sort(), ['number', 'path', 'repeater'])) {

      if (_.isEqual(expectedMessageComponentKeys, ['equals', 'path', 'repeatingGroup'])
        || _.isEqual(expectedMessageComponentKeys, ['dateFormat', 'equals', 'path', 'repeatingGroup'])
        || _.isEqual(expectedMessageComponentKeys, ['attribute', 'equals', 'path', 'repeatingGroup'])
        || _.isEqual(expectedMessageComponentKeys, ['attribute', 'dateFormat', 'equals', 'path', 'repeatingGroup'])
        || _.isEqual(expectedMessageComponentKeys, ['attribute', 'contains', 'path', 'repeatingGroup'])
        || _.isEqual(expectedMessageComponentKeys, ['contains', 'path', 'repeatingGroup'])
        || _.isEqual(expectedMessageComponentKeys, ['path', 'pathShouldNotExist', 'repeatingGroup'])) {
        type = messageComponentType.XML_REPEATING_GROUP;
        expected = _.omit(_.clone(expectedMessageComponent), ['path', 'repeatingGroup', 'attribute']);
      }

    } else if (_.has(expectedMessageComponent, 'parentPath')) {

      if (_.isEqual(expectedMessageComponentKeys, ['element', 'elementPosition', 'equals', 'parentPath'])
        || _.isEqual(expectedMessageComponentKeys, ['dateFormat', 'element', 'elementPosition', 'equals', 'parentPath'])
        || _.isEqual(expectedMessageComponentKeys, ['contains', 'element', 'elementPosition', 'parentPath'])
        || _.isEqual(expectedMessageComponentKeys, ['attribute', 'element', 'elementPosition', 'equals', 'parentPath'])
        || _.isEqual(expectedMessageComponentKeys, ['attribute', 'dateFormat', 'element', 'elementPosition', 'equals', 'parentPath'])
        || _.isEqual(expectedMessageComponentKeys, ['attribute', 'contains', 'element', 'elementPosition', 'parentPath'])
        || _.isEqual(expectedMessageComponentKeys, ['element', 'elementPosition', 'parentPath', 'pathShouldNotExist'])) {

        if (!Number.isInteger(expectedMessageComponent.elementPosition)) throw new Error('elementPosition should be an integer');
        if (expectedMessageComponent.elementPosition < 1) throw new Error('elementPosition should be greater than 0');
        type = messageComponentType.XML_POSITION;
        expected = _.omit(_.clone(expectedMessageComponent), ['parentPath', 'element', 'elementPosition', 'attribute']);
      }

    } else {

      if (_.isEqual(expectedMessageComponentKeys, ['equals', 'path'])
        || _.isEqual(expectedMessageComponentKeys, ['dateFormat', 'equals', 'path'])
        || _.isEqual(expectedMessageComponentKeys, ['contains', 'path'])
        || _.isEqual(expectedMessageComponentKeys, ['attribute', 'equals', 'path'])
        || _.isEqual(expectedMessageComponentKeys, ['attribute', 'dateFormat', 'equals', 'path'])
        || _.isEqual(expectedMessageComponentKeys, ['attribute', 'contains', 'path'])
        || _.isEqual(expectedMessageComponentKeys, ['path', 'pathShouldNotExist'])) {
        type = messageComponentType.XML_STANDARD;
        expected = _.omit(_.clone(expectedMessageComponent), ['path', 'attribute']);
      }
    }

  } else if (messageType === 'position') {
    if (_.isEqual(expectedMessageComponentKeys, ['begin', 'end', 'equals'])
      || _.isEqual(expectedMessageComponentKeys, ['begin', 'contains', 'end'])) {

      if (!Number.isInteger(expectedMessageComponent.begin)) throw new Error('begin should be an integer');
      if (!Number.isInteger(expectedMessageComponent.end)) throw new Error('end should be an integer');
      if (expectedMessageComponent.begin < 0) throw new Error('begin should be greater or equal to 0');
      if (expectedMessageComponent.end < 0) throw new Error('end should be greater or equal to 0');
      if (expectedMessageComponent.end < expectedMessageComponent.begin) throw new Error('end should be greater than begin');

      type = messageComponentType.POSITION_DELIMITED;
      expected = _.omit(_.clone(expectedMessageComponent), ['begin', 'end']);
    }

  } else {
    throw new Error('messageType ' + messageType + ' not expected');
  }

  if (type === 'UNKNOWN') throw new Error('Expected message component does not match any expected patterns. The invalid component is ' + JSON.stringify(expectedMessageComponent));

  return {
    type: type,
    expected: expected
  };
}


function getPathToXmlElement(expectedMessageComponent, type, actualMessageXmlDocument) {
  // returns undefined if cannot find element, otherwise it returns xmlDoc type
  var pathToElement;

  if (type === messageComponentType.XML_STANDARD) {

    var path = expectedMessageComponent.path,
      pathIsRootElement = expectedMessageComponent.path === actualMessageXmlDocument.name,
      attribute = expectedMessageComponent.attribute,
      pathExists;

    if (pathIsRootElement) {
      pathExists = true;
    } else {

      if (path.substring(0, actualMessageXmlDocument.name.length + 1).toLowerCase() != actualMessageXmlDocument.name.toLowerCase() + '.') {
        pathExists = false;
      } else {
        path = path.substring(actualMessageXmlDocument.name.length + 1, path.length);
        pathExists = actualMessageXmlDocument.descendantWithPath(path) != undefined;
      }
    }

    if (pathExists) {
      if (attribute && pathIsRootElement) {
        pathToElement = _.has(actualMessageXmlDocument.attr, attribute) ? actualMessageXmlDocument : undefined;
      } else if (attribute) {
        pathToElement = _.has(actualMessageXmlDocument.descendantWithPath(path).attr, attribute) ? actualMessageXmlDocument.descendantWithPath(path) : undefined;
      } else if (pathIsRootElement) {
        pathToElement = actualMessageXmlDocument;
      } else {
        pathToElement = actualMessageXmlDocument.descendantWithPath(path);
      }
    }

  } else if (type === messageComponentType.XML_POSITION) {
    var parentPathIsRootElement, pathToParentElement, countOfChildElements, elementAtSpecifiedPosition;

    parentPathIsRootElement = expectedMessageComponent.parentPath === actualMessageXmlDocument.name;
    pathToParentElement = expectedMessageComponent.parentPath;
    attribute = expectedMessageComponent.attribute;

    if (!parentPathIsRootElement) {
      if (pathToParentElement.substring(0, actualMessageXmlDocument.name.length + 1).toLowerCase() != actualMessageXmlDocument.name.toLowerCase() + '.') {
        return undefined;
      } else {
        pathToParentElement = pathToParentElement.substring(actualMessageXmlDocument.name.length + 1, pathToParentElement.length);
      }
    }

    if (parentPathIsRootElement) {
      countOfChildElements = actualMessageXmlDocument.children.length;
    } else {

      if (_.isUndefined(actualMessageXmlDocument.descendantWithPath(pathToParentElement))) {
        return undefined;
      } else {
        countOfChildElements = actualMessageXmlDocument.descendantWithPath(pathToParentElement).children.length;
      }
    }

    if (countOfChildElements >= expectedMessageComponent.elementPosition) {
      var expectedPosition = expectedMessageComponent.elementPosition - 1;
      elementAtSpecifiedPosition = parentPathIsRootElement ? actualMessageXmlDocument.children[expectedPosition] : actualMessageXmlDocument.descendantWithPath(pathToParentElement).children[expectedPosition];

      if (elementAtSpecifiedPosition.name === expectedMessageComponent.element) {
        if (_.has(expectedMessageComponent, 'attribute')) {
          pathToElement = _.has(elementAtSpecifiedPosition.attr, attribute) ? elementAtSpecifiedPosition : undefined;
        } else {
          pathToElement = elementAtSpecifiedPosition;
        }
      }
    }

  } else if (type === messageComponentType.XML_REPEATING_GROUP) {
    var pathIsRootElement, pathToElementEnclosingRepeatingGroup, repeatingElement, pathToElementFromRepeatingElement, version, matchingGroups;

    pathToElementEnclosingRepeatingGroup = expectedMessageComponent.repeatingGroup.path;
    repeatingElement = expectedMessageComponent.repeatingGroup.repeater;
    pathToElementFromRepeatingElement = expectedMessageComponent.path;
    version = expectedMessageComponent.repeatingGroup.number;
    pathIsRootElement = pathToElementEnclosingRepeatingGroup === actualMessageXmlDocument.name;
    attribute = expectedMessageComponent.attribute;

    if (!pathIsRootElement) {
      if (pathToElementEnclosingRepeatingGroup.substring(0, actualMessageXmlDocument.name.length + 1).toLowerCase() != actualMessageXmlDocument.name.toLowerCase() + '.') {
        return undefined;
      } else {
        pathToElementEnclosingRepeatingGroup = pathToElementEnclosingRepeatingGroup.substring(actualMessageXmlDocument.name.length + 1, pathToElementEnclosingRepeatingGroup.length);
      }
    }

    if (!pathIsRootElement && _.isUndefined(actualMessageXmlDocument.descendantWithPath(pathToElementEnclosingRepeatingGroup))) {
      return undefined;
    }

    matchingGroups = _(pathIsRootElement ? actualMessageXmlDocument.children : actualMessageXmlDocument.descendantWithPath(pathToElementEnclosingRepeatingGroup).children)
      .pluck('name')
      .map(function (el, index) {
        if (el === repeatingElement) return index;
        return -1;
      })
      .filter(function (el) {
        return el != -1;
      })
      .value();

    if (matchingGroups.length > 0 && version <= matchingGroups.length) {
      pathToElement = pathIsRootElement ? actualMessageXmlDocument.children[matchingGroups[version - 1]].descendantWithPath(pathToElementFromRepeatingElement) : actualMessageXmlDocument.descendantWithPath(pathToElementEnclosingRepeatingGroup).children[matchingGroups[version - 1]].descendantWithPath(pathToElementFromRepeatingElement);
      if (_.has(expectedMessageComponent, 'attribute')) {
        if (!_.has(pathToElement.attr, attribute)) {
          return undefined;
        }
      }
    }

  } else {
    throw new Error('Unexpected messageComponentType')
  }

  return pathToElement;
}

function getValueAtPath(pathToElement, attribute) {
  if (attribute) {
    return pathToElement.attr[attribute];
  } else {
    return pathToElement.val;
  }
}

function determinePrintablePath(expectedMessageComponent) {
  return _.omit(expectedMessageComponent, ['equals', 'dateFormat', 'contains', 'pathShouldNotExist']);
}
