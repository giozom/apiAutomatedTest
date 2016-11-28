var cleanRawXmlMessage = function cleanRawXmlMessage(rawMessage) {
  var scanMessageFromPosition, cleansedMessage, xmlTagPosition;

  xmlTagPosition = rawMessage.toLowerCase().indexOf('<?xml');

  if (xmlTagPosition != -1) {
    scanMessageFromPosition = xmlTagPosition;
  } else {
    scanMessageFromPosition = rawMessage.indexOf('<');
  }

  cleansedMessage = rawMessage.substr(scanMessageFromPosition);

  if (xmlTagPosition != -1) {
    cleansedMessage =
      rawMessage.replace(/(<\?xml)/gi, '<?XML')
        .replace(/<([a-z0-9\-]+):/gi, function (str) {
          if (str != '<?XML:') {
            return '<';
          } else {
            return str;
          }
        })
        .replace(/<\/([a-z0-9\-]+):/gi, '</');
  } else {
    cleansedMessage =
      rawMessage.replace(/<([a-z0-9\-]+):/gi, '<')
        .replace(/<\/([a-z0-9\-]+):/gi, '</');
  }

  return cleansedMessage;
};

module.exports = cleanRawXmlMessage;
