"use strict";


/**
 * @name 5-tuple
 * @type data constructor
 * @example

   @see Pair
 
 */


// (a, b, c, d, e) -> ((a, b, c, d, e) => f) -> f
const Tuple5 = (v, w, x, y, z) => f => f(v, w, x, y, z);


// API


module.exports = Tuple5;