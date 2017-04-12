"use strict";


// dependencies


const Pair = require("./Pair");


/**
 * @name bimap over a pair
 * @type higher order function
 * @example

   const pair = Pair(1, "a");
   bimap(x => x + 1) (x => "" + x + x) (pair) (toArray); // [2, "aa"]

 */


// Tuple t => (a -> b) -> (c -> d) -> t a c -> t b d
const bimap = f => g => t => t((x, y) => Pair(f(x), g(y)));


// API


module.exports = bimap;