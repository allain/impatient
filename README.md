# impatient

[![NPM version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]

> A tool for turning asynchronous things into impatient versions of themselves

## Install

```sh
npm installimpatient
```

## Usage

```js
var impatient = require('impatient');
var sleep = require('sleep-promise');

impatient(sleep(1000), 50 /* max patience */).catch(function(err) {
  // cancels the wait with Error('timeout')
  console.log(err);
});
```

By default, it does not stop the promise's execution path, but when it gets to its resolution, the result will be dropped.

If you want to cleanup, you may hook an abort method onto the promise and it'll get invoked.

```js
var impatient = require('impatient');
var sleep = require('sleep-promise');

var delayed = sleep(1000);
delayed.abort = function() {
  console.log('ABORTING DELAY');
  
  // Returning a promise will cause impatient to wait till it resolves before officially rejecting the promise.
};

impatient(sleep(1000), 50 /* max patience */).catch(function(err) {
  // cancels the wait with Error('timeout')
  console.log(err);
});
```

## License

MIT © [Allain Lalonde](http://github.com/allain)

[npm-url]: https://npmjs.org/package/impatient
[npm-image]: https://img.shields.io/npm/v/impatient.svg?style=flat-square

[travis-url]: https://travis-ci.org//impatient
[travis-image]: https://img.shields.io/travis//impatient.svg?style=flat-square