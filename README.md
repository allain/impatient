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

// impatient promise (wait for 1000ms but reject at 50ms)
impatient(sleep(1000), 50 /* max patience */).catch(function(err) {
  console.error('promise rejection', err); // timeout error
});

// impatient callback (wait for 1000ms but give up at 50ms)
var impatientCb = impatient(function(cb) { setTimeout(cb, 1000); }, 50 /*max patience*/);

impatientCb(function(err) {
  console.error('callback error', err); // timeout error
});
```

If you want to perform some cleanup on aborting, you may pass in a function as the 3rd param to impatient.

```js
impatient(sleep(1000), 50, function() {
  console.log('cleanup');
  // return optional promise, which will delay the resolution till cleanup is done
}).catch(function(err) {
  // cancels the wait with Error('timeout')
  console.error(err);
});

var impatientCb = impatient(function(cb) { setTimeout(cb, 1000); }, 50, function(cb) {
  console.log('cleaning up cb');
  cb();
});

impatientCb(function(err) {
  console.error('callback error', err);
});
```

## License

MIT © [Allain Lalonde](http://github.com/allain)

[npm-url]: https://npmjs.org/package/impatient
[npm-image]: https://img.shields.io/npm/v/impatient.svg?style=flat-square

[travis-url]: https://travis-ci.org/allain/impatient
[travis-image]: https://img.shields.io/travis/allain/impatient.svg?style=flat-square