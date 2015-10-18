var isPromise = require('is-promise');
var Promise = require('native-promise-only');

module.exports = function impatient(target, timeout, aborter) {
  if (isPromise(target)) {
    return impatientPromise(target, timeout, aborter);
  } else if (typeof target === 'function') {
    return impatientCallback(target, timeout, aborter);
  }
};

function impatientPromise(target, timeout, aborter) {
  var aborted;

  aborter = (aborter || target.abort || function() {}).bind(target);

  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      if (aborted === undefined) {
        aborted = true;
        Promise.resolve(aborter()).then(function () {
          reject(new Error('timeout'));
        });
      }
    }, timeout);

    target.then(processor(resolve), processor(reject));
  });

  function processor(process) {
    return function(result) {
      if (aborted === undefined) {
        aborted = false;
        process(result);
      }
    };
  }
}



function impatientCallback(target, timeout, aborter) {
  var _aborter;
  if (aborter) {
    _aborter = function() {
      return new Promise(function(resolve) {
        aborter(function (err) {
          if (err) {
            console.error(err);
          }
          resolve();
        });
      });
    };
  }

  return function() {
    var args = Array.prototype.slice.call(arguments);
    var cb = args.pop();

    impatientPromise(new Promise(function(resolve, reject) {
      args.push(function(err, result) {
        return err ? reject(err) : resolve(result);
      });
      target.apply(null, args);
    }), timeout, _aborter).then(function(result) {
      cb(null, result);
    }, function(err) {
      cb(err);
    });
  };
}
