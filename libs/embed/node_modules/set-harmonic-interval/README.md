# set-harmonic-interval

Works similar to `setInterval`, but calls all callbacks scheduled using `setHarmonicInterval` all at once, which have same
delay in milliseconds.

## Install

```
npm install set-harmonic-interval
```

## Usage

In below example `1` and `2` will always be printed together every second.

```js
const { setHarmonicInterval, clearHarmonicInterval } = require('set-harmonic-interval');

setHarmonicInterval(() => console.log(1), 1000);
setTimeout(() => {
  setHarmonicInterval(() => console.log(2), 1000);
}, 500);
```


## License

[Unlicense](LICENSE) &mdash; public domain.
