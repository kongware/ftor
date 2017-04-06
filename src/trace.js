"use strict";


/**
 * @name trace
 * @type impure operator function
 * @example
 *

   const inc = x => x + 1;
   B_(trace("trace:"), inc) (2); // logs trace: 3

 */


// ?
const trace = tag => x => (console.log(tag, x), x);


// API


module.exports = trace;