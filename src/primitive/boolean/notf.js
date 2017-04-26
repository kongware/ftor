"use strict";


/**
 * @name negate function
 * @type higher order function
 * @status stable
 * @example

   const notf2 = f => x => y => !f(x) (y);
   const eq = x => y => x === y;

   notf2(eq) ("foo") ("bar"); // true

 */


// (a -> b) -> a -> Boolean
const notf = f => x => !f(x);


// (a -> b -> c) -> a -> b -> Boolean
const notf2 = f => x => y => !f(x) (y);


// (a -> b -> c -> d) -> a -> b -> c -> Boolean
const notf3 = f => x => y => z => !f(x) (y) (z);


// API


module.exports = {notf, notf2, notf3};