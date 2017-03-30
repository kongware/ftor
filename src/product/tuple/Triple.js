"use strict";


/**
 * @name triple tuple
 * @type ternary constructor
 * @example
 *

   Triple(1, 2, 3) ((x, _, _) => x); // 1
   Triple(1, 2, 3) ((_, y, _) => x); // 2
   Triple(1, 2, 3) ((_, _, z) => x); // 3

 */


// (a, b, c) -> ((a, b, c) => d) -> d
const Triple = (x, y, z) => f => f(x, y, z);


// API


module.exports = Triple;