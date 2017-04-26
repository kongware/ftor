"use strict";


/**
 * @name has
 * @type first order function
 * @example

   ?

 */


// k -> Map|WeakMap|Set|WeakSet -> Boolean
const has = k => t => t.has(k);


// API


module.exports = has;