"use strict";


/**
 * @name strict evaluation
 * @type higher order function
 * @example

   ?

 */


// (a -> () -> b) -> a -> b
const strict = f => x => f(x) ();


// (a -> b -> () -> c) -> a -> b -> c
const strict2 = f => x => y => f(x) (y) ();


// (a -> b -> c -> () -> d) -> a -> b -> c -> d
const strict3 = f => x => y => z => f(x) (y) (z) ();


// API


module.exports = {strict, strict2, strict3};