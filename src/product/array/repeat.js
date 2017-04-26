"use strict";


/**
 * @name repeat
 * @type first order function
 * @example

   const repeat = n => x => Array(n).fill(x);
   repeat(3) ("ha"); // ["ha", "ha", "ha"]

 */


// Number -> a -> [a]
const repeat = n => x => Array(n).fill(x);


// API


module.exports = repeat;