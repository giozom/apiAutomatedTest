var _ = require('lodash'),
  checks, allChecksPassed;

var verificationResults = {

  initialise: function initialise() {
    checks = [];
    allChecksPassed = true;
  },

  /**
   * @param {object} checkDetails
   * @param {boolean} checkDetails.pass The result of the comparison between actual and expected
   * @param {string} checkDetails.path The path being checked
   * @param {any type} checkDetails.actual The actual value at the path being checked
   * @param {any type} checkDetails.expected The expected value / operator at the path being checked
   * @param {string} checkDetails.description The type of check applied to the actual value
   */
  add: function add(checkDetails) {
    //var properties, expectedProperties;
    //properties = _.keys(checkDetails).sort();
    //expectedProperties = ['actual', 'description', 'expected', 'pass', 'path'];

    if (!_.has(checkDetails, 'pass')){'"pass" is mandatory.'}

    //if (!_.isEqual(properties, expectedProperties)) throw new Error('Expected properties ' + JSON.stringify(expectedProperties) + ' but got ' + JSON.stringify(properties));
    if (!checkDetails.pass) allChecksPassed = false;
    checks.push(checkDetails);
  },

  getOverallResult: function getOverallResult() {
    return allChecksPassed;
  },

  getAllChecks: function getAllChecks(verbose) {
    if (!verbose){

      return checks.filter(function(el){
        return el.pass === false;
      });
    }
    return checks;
  }
};

module.exports = verificationResults;