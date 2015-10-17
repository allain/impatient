var test = require('blue-tape');
var impatient = require('../index');

test('leaves everything as is if promise resolves before timeout', function(t) {
  var RESULT = {};

  impatient(delay(10, RESULT), 50).then(function(value) {
    t.ok(value === RESULT, 'results in strictly same result');
    t.end();
  }, t.fail);
});

test('rejects if promise takes too long', function(t) {
  impatient(delay(50), 10).then(t.fail, function(err) {
    t.ok(err instanceof Error, 'rejects with an Error');
    t.equal(err.message, 'timeout', 'message is about timeout');
    t.end();
  });
});

test('if Promise has .abort method, calls it on timeout', function(t) {
  var promise = delay(50);

  var aborted = false;
  promise.abort = function() {
    aborted = true;
  };

  impatient(promise, 10).then(t.fail, function(err) {
    t.ok(aborted, 'abort gets called');
    t.end();
  });
});

test('if aborter param given, calls it on timeout', function(t) {
  var promise = delay(50);

  var aborted = false;
  impatient(promise, 10, function() {
    aborted = true;
  }).then(t.fail, function(err) {
    t.ok(aborted, 'abort gets called');
    t.end();
  });
});

test('rejection does not happen till after aborter is resolved', function(t) {
  var started = Date.now();

  var promise = delay(50);
  promise.abort = function() {
    return delay(10);
  };

  impatient(promise, 10).then(t.fail, function(err) {
    t.ok(Date.now() - started >= 15, 'took long enough to account for slow abort');

    t.end();
  }).catch(t.fail);
});

function delay(time, value) {
  return new Promise(function (resolve) {
    setTimeout(resolve.bind(null, value), time);
  });
}
