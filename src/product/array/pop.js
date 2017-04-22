"use strict";


// dependencies


const Pair = require("../tuple/Pair");


/**
 * @name pop
 * @note pop_ is a destructive operation!!!
 * @type operator function
 * @example

   ?
 
 */


// [a] -> (([a], a) -> b)
const pop = xs => Pair(xs.slice(0, -1), xs[xs.length - 1]);


// [a] -> (([a], a) -> b)
const pop_ = xs => Pair(xs, xs.pop());


// API


module.exports = {pop, pop_};