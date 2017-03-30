"use strict";


/**
 * @name rotate left
 * @type operator function
 * @example
 *

   rotatel(1, 2, 3) (get1); // 2

 */


// (b, c, a) -> ((a, b, c) -> d) -> d
const rotatel = (y, z, x) => f => f(x, y, z);


// (b, c, d, a) -> ((a, b, c, d) -> e) -> e
const rotatel4 = (x, y, z, w) => f => f(w, x, y, z);


// (b, c, d, e, a) -> ((a, b, c, d, e) -> f) -> f
const rotatel5 = (w, x, y, z, v) => f => f(v, w, x, y, z);


// API


module.exports = {rotatel, rotatel4, rotatel5};