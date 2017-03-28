"use strict";


/**
 * @name uncurry binary operator function
 * @type higher order function
 * @example
 *

   uncurryOp(y => x => x - y) (3, 2); // 1

 */


// (a -> b -> c) -> (b, a) -> c
const uncurryOp = f => (y, x) => f(x) (y);


// API


module.exports = uncurryOp;