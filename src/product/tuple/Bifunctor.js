"use strict";


// dependencies


const Pair = require("./Pair");


/**
 * @name Bifunctor type class
 * @type type representative
 * @kind * -> * -> *
 */


const Bifunctor = {};


/**
 * @name bimap
 * @type higher order function
 * @example

   const Pair = (x, y) => f => f(x, y);
   const toArray = (...args) => args;
   
   const Bifunctor = {};
   Bifunctor.bimap = f => g => t => t((x, y) => Pair(f(x), g(y)));

   const pair = Pair(1, "a");
   
   Bifunctor.bimap(x => x + 1) (x => "" + x + x) (pair) (toArray); // [2, "aa"]

 */


// (a -> b) -> (c -> d) -> ((a, c) -> e) -> ((b, d) -> e)
Bifunctor.bimap = f => g => t => t((x, y) => Pair(f(x), g(y)));


// API


module.exports = Bifunctor;