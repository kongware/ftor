"use strict";


/**
 * @name fourth item
 * @type operator function
 * @example
 *

   const tuple4 = Tuple4(1, 2, 3, 4);
   tuple4(_4th); // 4

 */


// (a, b, c, d) -> ((_, _, _, d) => d) -> d
const _4th = (_, _, _, z) => z;


// API


module.exports = _4th;