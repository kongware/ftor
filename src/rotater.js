"use strict";


/**
 * @name rotate right
 * @type higher order function
 * @example

   @see rotatel

 */


// ((a, b, c) -> d) -> (c, a, b) -> d
const rotater = f => (z, x, y) => f(x, y, z);


// ((a, b, c, d) -> e) -> (d, a, b, c) -> e
const rotater4 = f => (z, w, x, y) => f(w, x, y, z);


// ((a, b, c, d, e) -> f) -> (e, a, b, c, d) -> f
const rotater5 = f => (z, v, w, x, y) => f(v, w, x, y, z);


// API


module.exports = {rotater, rotater4, rotater5};