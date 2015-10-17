var isPromise = require('is-promise');
var Promise = require('native-promise-only');

module.exports = function (target, timeout, aborter) {
  if (isPromise(target)) {
    var aborted;

    aborter = (aborter || target.abort || function() {}).bind(target);

    return new Promise(function(resolve, reject) {
      setTimeout(function() {
        if (aborted === undefined) {
          aborted = true;
          Promise.resolve(aborter()).then(function () {
            reject(new Error('timeout'));
          });
        }
      }, timeout);

      target.then(function(result) {
        if (aborted === undefined) {
          aborted = false;
          resolve(result);
        }
      }, function(err) {
        if (aborted === undefined) {
          aborted = false;
          reject(err);
        }
      });
    });
  }
};