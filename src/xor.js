"use strict";


/**
 * @name logical xor
 * @type operator function
 * @example
 *

   xor("default") ({}) (1); // "default"

 */


// a -> b -> c -> a|b|c
const xor = _default => y => x => !x === !y ? _default : x || y;


// API


module.exports = xor;