"use strict";


/**
 * @name rotate right
 * @type higher order function
 * @example

   rotater(1, 2, 3) (_1st); // 3

 */


// (c, a, b) -> ((a, b, c) -> d) -> d
const rotater = (z, x, y) => f => f(x, y, z);


// (d, a, b, c) -> ((a, b, c, d) -> e) -> e
const rotater4 = (z, w, x, y) => f => f(w, x, y, z);


// (e, a, b, c, d) -> ((a, b, c, d, e) -> f) -> f
const rotater5 = (z, v, w, x, y) => f => f(v, w, x, y, z);


// API


module.exports = {rotater, rotater4, rotater5};