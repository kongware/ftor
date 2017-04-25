"use strict";


/**
 * @name lazy evaluation
 * @type higher order function
 * @example

   ?

 */


// (a -> b) -> a -> () -> b
const lazy = f => x => () => f(x);


// (a -> b -> c) -> a -> b -> () -> c
const lazy2 = f => x => y => () => f(x) (y);


// (a -> b -> c -> d) -> a -> b -> c -> () -> d
const lazy3 = f => x => y => z => () => f(x) (y) (z);


// API


module.exports = {lazy, lazy2, lazy3};