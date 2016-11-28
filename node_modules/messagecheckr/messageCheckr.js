var convertToXmlDocumentType = require('./libs/convertToXmlDocumentType'),
  validateParams = require('./libs/validateParams.js'),
  cleanRawSoapMessage = require('./libs/cleanRawSoapMessage'),
  cleanRawXmlMessage = require('./libs/cleanRawXmlMessage'),
  verificationResults = require('./libs/verificationResults'),
  assertions = require('./libs/assertions'),
  store = require('./libs/store'),
  messageComponent = require('./libs/messageComponent');

var messageCheckr = function messageCheckr(params) {
  var type, actualMsg, expectedMsg, expectedRootElement, cleansedMessage, xmlDocument;

  validateParams(params);
  verificationResults.initialise();
  store.initialise();

  type = params.type;
  actualMsg = params.actualMsg;
  expectedMsg = params.expectedMsg;
  expectedRootElement = params.expectedRootElement;

  if (type === 'soap') {
    cleansedMessage = cleanRawSoapMessage(actualMsg);
    xmlDocument = convertToXmlDocumentType(cleansedMessage);
    assertions.checkRootElement(xmlDocument, 'SOAP-ENV:Envelope');
    checkAllMessageComponents('xml', xmlDocument, expectedMsg);
  } else if (type === 'jms') {
    cleansedMessage = cleanRawXmlMessage(actualMsg);
    xmlDocument = convertToXmlDocumentType(cleansedMessage);
    assertions.checkRootElement(xmlDocument, expectedRootElement);
    checkAllMessageComponents('xml', xmlDocument, expectedMsg);
  } else if (type === 'position'){
    if (!_.isString(actualMsg)) throw new Error('actualMsg should be a string when type is "position"');
    checkAllMessageComponents('position', actualMsg, expectedMsg)
  } else {
    throw new Error('type "' + type + '" is not handled');
  }

  return ({allChecksPassed: verificationResults.getOverallResult(), checks: verificationResults.getAllChecks(params.verbose)});
};

function checkAllMessageComponents(messageType, actualMsg, expectedMsg) {
  expectedMsg.forEach(function (expectedMsgComponent) {
    var msgComponent = messageComponent(messageType, expectedMsgComponent, actualMsg);
    assertions.verifyMessageComponent(msgComponent);
  });
}

module.exports = messageCheckr;