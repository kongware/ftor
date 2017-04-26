"use strict";


// dependencies


const Pair = require("../tuple/Pair");


/**
 * @name shift
 * @note shift_ is a destructive operation!!!
 * @type first order function
 * @example

   ?
 
 */


// [a] -> ((a, [a]) -> b)
const shift = xs => Pair(xs[0], xs.slice(1));


// [a] -> ((a, [a]) -> b)
const shift_ = xs => Pair(xs.shift(), xs);


// API


module.exports = {shift, shift_};