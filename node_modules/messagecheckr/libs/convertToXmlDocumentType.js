var xmldoc = require('xmldoc');

var convertToXmlDocumentType = function (message) {
  return new xmldoc.XmlDocument(message);
};

module.exports = convertToXmlDocumentType;

