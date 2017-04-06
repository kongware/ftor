"use strict";


/**
 * @name negate function
 * @type higher order function
 * @example
 *

   const eq = y => x => x === y;
   negf2(eq) (2) (2); // false

 */


// (a -> b) -> a -> Boolean
const negf = negf = f => x => !f(x);


// (a -> b -> c) -> a -> b -> Boolean
const negf2 = f => x => y => !f(x) (y);


// (a -> b -> c -> d) -> a -> b -> c -> Boolean
const negf3 = f => x => y => z => !f(x) (y) (z);


// API


module.exports = {negf, negf2, negf3};