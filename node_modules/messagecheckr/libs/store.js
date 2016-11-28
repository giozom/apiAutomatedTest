var keyValueStore;

var store = {

  initialise: function initialise() {
    keyValueStore = {};
  },

  add: function add(key, value) {
    if (Object.keys(keyValueStore).indexOf(key) > -1) {
      throw new Error('The store name you have provided is already is use.');
    }
    keyValueStore[key] = value;
  },

  get: function get(key) {
    if (Object.keys(keyValueStore).indexOf(key) === -1) {
      throw new Error('The store name you have provided to compare to does not exist.');
    }
    return keyValueStore[key];
  }
};

module.exports = store;


