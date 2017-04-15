"use strict";


/**
 * @name triple tuple
 * @type data constructor
 * @example

   @see Pair

 */


// (a, b, c) -> ((a, b, c) => d) -> d
const Triple = (x, y, z) => f => f(x, y, z);


// API


module.exports = Triple;