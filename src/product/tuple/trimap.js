"use strict";


// dependencies


const Triple = require("./Triple");


/**
 * @name trimap over a pair
 * @type higher order function
 * @class Bifunctor
 * @example

   @see bimap
   
 */


// (a -> b) -> (c -> d) -> (e -> f) -> ((a, c, e) -> g) -> ((b, d, f) -> g)
const trimap = f => g => h => t => t((x, y, z) => Pair(f(x), g(y)));


// API


module.exports = trimap;