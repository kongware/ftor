"use strict";


/**
 * @name tap
 * @type action
 * @status stable
 * @example

  const tap = f => x => (f(x), x);
  const typeLogger = x => console.log(typeof x);

  tap(typeLogger) (2); // 2 (logs "number")

 */


// ?
const tap = f => x => (f(x), x);


// API


module.exports = tap;