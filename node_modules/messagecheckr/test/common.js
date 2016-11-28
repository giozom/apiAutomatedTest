global.chai = require('chai');
global.assert = chai.assert;
global.expect = chai.expect;
chai.use(require('chai-subset'));

global.winston = require('winston');
winston.level = 'info'; // options are 'info' or 'debug'
global.rewire = require('rewire');
global._ = require('lodash');
global.messageCheckr = require('../messageCheckr.js');