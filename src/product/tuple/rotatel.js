"use strict";


// dependencies


const Tuple = require("./Tuple");


/**
 * @name rotate left
 * @type higher order function
 * @example

   @see rotater

 */


// (b, c, a) -> ((a, b, c) -> d)
const rotatel = (y, z, x) => Tuple(x, y, z);


// (b, c, d, a) -> ((a, b, c, d) -> e)
const rotatel4 = (x, y, z, w) => Tuple(w, x, y, z);


// (b, c, d, e, a) -> ((a, b, c, d, e) -> f)
const rotatel5 = (w, x, y, z, v) => Tuple(v, w, x, y, z);


// API


module.exports = {rotatel, rotatel4, rotatel5};