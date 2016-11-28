global.chai = require('chai');
global.expect = chai.expect;
global.assert = chai.assert;
chai.config.truncateThreshold = 0;
chai.config.includeStack = true;
chai.config.showDiff = true;
chai.should();
chai.use(require('chai-subset'));

global.utils = require('../utils.js');
global._ = require('lodash');
