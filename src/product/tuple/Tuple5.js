"use strict";


/**
 * @name 5-tuple
 * @type quinary constructor
 * @example
 *

   Tuple4(1, 2, 3, 4, 5) ((_, _, _, _, z) => z); // 5
 
 */


// (a, b, c, d, e) -> ((a, b, c, d, e) => f) -> f
const Tuple4 = (v, w, x, y, z) => f => f(v, w, x, y, z);


// API


module.exports = Tuple4;