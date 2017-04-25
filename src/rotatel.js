"use strict";


/**
 * @name rotate left
 * @type higher order function
 * @example

   ?

 */


// ((a, b, c) -> d) -> (b, c, a) -> d
const rotatel = f => (y, z, x) => f(x, y, z);


// ((a, b, c, d) -> e) -> (b, c, d, a) -> e
const rotatel4 = f => (x, y, z, w) => f(w, x, y, z);


// ((a, b, c, d, e) -> f) -> (b, c, d, e, a) -> f
const rotatel5 = f => (w, x, y, z, v) => f(v, w, x, y, z);


// API


module.exports = {rotatel, rotatel4, rotatel5};