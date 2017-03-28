"use strict";


/**
 * @name repeat
 * @type higher order function
 * @example
 *

   repeat(3) ("ha"); // ["ha", "ha", "ha"]

 */


// Number -> a -> [a]
const repeat = n => x => Array(n).fill(x);


// (Number, a) -> [a]
const repeat_ = (x, n) => Array(n).fill(x);


// API


module.exports = {repeat, repeat_};