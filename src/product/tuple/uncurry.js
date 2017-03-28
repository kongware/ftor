"use strict";


/**
 * @name uncurry function
 * @type higher order function
 * @example
 *

   uncurry((x, y) => x + y) (2) (3); // 5

 */


// (a -> b -> c) -> (a, b) -> c
const uncurry = f => (x, y) => f(x) (y);


// (a -> b -> c -> d) -> (a, b, c) -> d
const uncurry3 = f => (x, y, z) => f(x) (y) (z);


// API


module.exports = {uncurry, uncurry3};