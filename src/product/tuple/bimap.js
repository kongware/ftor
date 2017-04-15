"use strict";


// dependencies


const Pair = require("./Pair");


/**
 * @name bimap over a pair
 * @type higher order function
 * @class Bifunctor
 * @example

   const Pair = (x, y) => f => f(x, y);
   const bimap = f => g => t => t((x, y) => Pair(f(x), g(y)));
   const pair = Pair(1, "a");
   
   bimap(x => x + 1) (x => "" + x + x) (pair) (toArray); // [2, "aa"]

 */


// (a -> b) -> (c -> d) -> ((a, c) -> e) -> ((b, d) -> e)
const bimap = f => g => t => t((x, y) => Pair(f(x), g(y)));


// API


module.exports = bimap;