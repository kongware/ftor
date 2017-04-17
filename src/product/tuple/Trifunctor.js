"use strict";


// dependencies


const Triple = require("./Triple");


/**
 * @name Trifunctor type class
 * @type type representative
 * @kind * -> * -> * -> *
 */


const Trifunctor = {};


/**
 * @name trimap
 * @type higher order function
 * @example

   @see Bifunctor.map
   
 */


// (a -> b) -> (c -> d) -> (e -> f) -> ((a, c, e) -> g) -> ((b, d, f) -> g)
Trifunctor.trimap = f => g => h => t => t((x, y, z) => Triple(f(x), g(y), h(z)));


// API


module.exports = Trifunctor;