# resize-start-end

resize-start-end is a small utility for detecting the start and/or end of a series of window resize events.

![demo](https://media.giphy.com/media/3o7aD89aoPIImWc5yM/giphy.gif)

### Installation

##### yarn
```
yarn add resize-start-end
```
##### npm
```
npm i resize-start-end -S
```

### Usage

```js
// ESM
import resizeStartEnd from 'resize-start-end';

// or CommonJS
const resizeStartEnd = require('resize-start-end');

// `debounceWaitTime` is a number in milliseconds that is passed to
// lodash.debounce. Defaults to 200.
const resize = resizeStartEnd({ debounceWaitTime: 150 });

// Begin listening for given type, 'start' or 'end'.
resize.on('start', myStartHandler);
resize.on('end', myEndHandler);

// Remove listener for given type and handler
resize.off('start', myStartHandler);
resize.off('end', myEndHandler);

// Check if the window is currently being resized
resize.isResizing(); // returns a boolean
```
