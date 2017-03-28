"use strict";


/**
 * @name 4-tuple
 * @type quaternary constructor
 * @example
 *

   Tuple4(1, 2, 3, 4) ((_, _, _, z) => z); // 4
 
 */


// (a, b, c, d) -> ((a, b, c, d) => e) -> e
const Tuple4 = (w, x, y, z) => f => f(w, x, y, z);


// API


module.exports = Tuple4;