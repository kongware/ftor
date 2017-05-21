"use strict";


/**
 * @name curry
 * @type higher order function
 * @status stable
 * @example

   const curry = f => x => y => f(x, y);
   const add = (x, y) => x + y;
   const add2 = curry(add) (2);

   add2(3); // 5

 */


// ((a, b) -> c) -> a -> b -> c
const curry = f => x => y => f(x, y);


// ((a, b, c) -> d) -> a -> b -> c -> d
const curry3 = f => x => y => z => f(x, y, z);


// API


module.exports = {curry, curry3};