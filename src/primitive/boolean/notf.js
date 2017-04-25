"use strict";


/**
 * @name negate function
 * @type higher order function
 * @example

   ?

 */


// (a -> b) -> a -> Boolean
const notf = f => x => !f(x);


// (a -> b -> c) -> a -> b -> Boolean
const notf2 = f => x => y => !f(x) (y);


// (a -> b -> c -> d) -> a -> b -> c -> Boolean
const notf3 = f => x => y => z => !f(x) (y) (z);


// API


module.exports = {notf, notf2, notf3};