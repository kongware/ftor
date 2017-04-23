"use strict";


/**
 * @name even
 * @type operator function
 * @example

   ?

 */


// Number -> Boolean
const even = x => Math.floor(x) === x && x & 1 === 0;


// API


module.exports = even;