"use strict";


// dependencies


const Pair = require("./Pair");


/**
 * @name swap
 * @type higher order function
 * @example

   const pair = Pair(2, 4);
   pair(swap); // Pair(4, 2)

 */


// (b, a) -> ((a, b) -> c)
const swap = (y, x) => Pair(x, y);


// API


module.exports = swap;