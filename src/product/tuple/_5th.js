"use strict";


/**
 * @name fifth
 * @type operator function
 * @example
 *

   const tuple5 = Tuple4(1, 2, 3, 4, 5);
   tuple5(_5th); // 5

 */


// (a, b, c, d, e) -> ((_, _, _, _, e) => e) -> e
const _5th = (_, _, _, _, z) => z;


// API


module.exports = _5th;