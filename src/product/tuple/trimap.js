"use strict";


// dependencies


const Triple = require("./Triple");


/**
 * @name trimap over a pair
 * @type higher order function
 * @example

   const triple = Triple(1, "a", false);
   trimap(x => x + 1) (x => "" + x + x) (x => x || true) (triple) (toArray); // [2, "aa", true]

 */


// (a -> b) -> (c -> d) -> (e -> f) -> ((a, c, e) -> g) -> ((b, d, f) -> g)
const trimap = f => g => h => t => t((x, y, z) => Pair(f(x), g(y)));


// API


module.exports = trimap;