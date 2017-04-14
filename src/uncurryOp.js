"use strict";


/**
 * @name uncurry operator function
 * @type higher order function
 * @example

   uncurryOp(y => x => x - y) (3, 2); // 1

 */


// (a -> b -> c) -> (b, a) -> c
const uncurryOp = f => (y, x) => f(x) (y);


// (a -> b -> c -> d) -> (c, a, b) -> d
const uncurryOp3 = f => (z, x, y) => f(x) (y) (z);


// API


module.exports = {uncurryOp, uncurryOp3};