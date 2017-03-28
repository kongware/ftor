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


// ((a -> b -> c), a) -> b -> Boolean
const negf2_ = (f, x) => y => !f(x) (y);


// (((a, b) -> c), a) -> b -> Boolean
const negf2__ = (f, x) => y => !f(x, y);


// (a -> b -> c -> d) -> a -> b -> c -> Boolean
const negf3 = f => x => y => z => !f(x) (y) (z);


// ((a -> b -> c -> d), a, b) -> c -> Boolean
const negf3_ = (f, x, y) => z => !f(x) (y) (z);


// (((a, b, c) -> d), a, b) -> c -> Boolean
const negf3__ = (f, x, y) => z => !f(x, y, z);


// API


module.exports = {negf, negf_, negf2, negf2_, negf2__, negf3, negf3_, negf3__};