"use strict";


/**
 * @name triplet tuple
 * @type ternary constructor
 * @example
 *

   Triplet(1, 2, 3) ((x, _, _) => x); // 1
   Triplet(1, 2, 3) ((_, y, _) => x); // 2
   Triplet(1, 2, 3) ((_, _, z) => x); // 3

 */


// (a, b, c) -> ((a, b, c) => d) -> d
const Triplet = (x, y, z) => f => f(x, y, z);


// API


module.exports = Triplet;