"use strict";


/**
 * @name logical xor
 * @type operator function
 * @example
 *

   xor_({}, 1); // 1
   xor_(1, {}); // {}
   xor_({}, null); // null
   xor_(null, {}); // null

 */


// a -> b -> c -> a|b|c
const xor = _default => y => x => !x === !y ? _default : x || y;


// (a, b, c) -> a|b|c
const xor_ = (x, y, _default) => !x === !y ? _default : x || y;


// API


module.exports = {xor, xor_};