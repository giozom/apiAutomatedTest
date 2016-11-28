var cleanRawSoapMessage = function cleanRawSoapMessage(rawMessage) {
  var scanMessageFromPosition, cleansedMessage;
  scanMessageFromPosition = 0;

  if (rawMessage.toLowerCase().indexOf('<soap') != -1) {
    scanMessageFromPosition = rawMessage.toLowerCase().indexOf('<soap');
  }

  cleansedMessage =
    rawMessage.substr(scanMessageFromPosition)
      .replace(/(soap-env|soapenv)/gi, 'SOAP-ENV')
      .replace(/<([a-z0-9\-]+):/gi, function (str) {
        if (str != '<SOAP-ENV:') {
          return '<';
        } else {
          return str;
        }
      })
      .replace(/<\/([a-z0-9\-]+):/gi, function (str) {
        if (str != '</SOAP-ENV:') {
          return '</';
        } else {
          return str;
        }
      });

  return cleansedMessage;
};

module.exports = cleanRawSoapMessage;
