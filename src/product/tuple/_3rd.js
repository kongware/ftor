"use strict";


/**
 * @name third item
 * @type operator function
 * @example
 *

   const triplet = Triplet(1, 2, 3);
   triplet(_3rd); // 3

 */


// (a, b, c) -> ((_, _, c) => c) -> c
const _3rd = (_, _, z) => z;


// API


module.exports = _3st;