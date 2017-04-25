"use strict";


/**
 * @name trace
 * @type impure operator function
 * @example

   ?

 */


// ?
const trace = tag => x => (console.log(tag, x), x);


// API


module.exports = trace;