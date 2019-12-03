/* eslint no-extend-native: 0 */
// core-js comes with Next.js. So, you can import it like below
import 'react-app-polyfill/ie11';
import includes from 'core-js/features/string/virtual/includes';
import repeat from 'core-js/features/string/virtual/repeat';
import assign from 'core-js/features/object/assign';
import padStart from 'core-js/features/string/pad-start';
import find from 'core-js/features/array/find';
import 'intersection-observer';

// Add your polyfills
// This files runs at the very beginning (even before React and Next.js core)
// console.log('Load your polyfills');

String.prototype.includes = includes;
String.prototype.repeat = repeat;
String.prototype.padStart = padStart;
Array.prototype.find = find;
Object.assign = assign;
