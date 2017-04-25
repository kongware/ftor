"use strict";


/**
 * @name composable transformator
 * @type higher order function
 * @example

   ?

 */


// (((*), a) -> b) -> (*) -> a -> b
const composable = f => (...args) => x => f(...args, x);


// API


module.exports = composable;