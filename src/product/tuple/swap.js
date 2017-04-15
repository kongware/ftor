"use strict";


// dependencies


const Pair = require("./Pair");


/**
 * @name swap
 * @type higher order function
 * @example

   const Pair = (x, y) => f => f(x, y);
   const swap = (y, x) => Pair(x, y);
   const toArray = (...args) => args;
   const pair = Pair(1, "a");

   pair(swap) (toArray); // ["a", 1]

 */


// (b, a) -> ((a, b) -> c)
const swap = (y, x) => Pair(x, y);


// API


module.exports = swap;