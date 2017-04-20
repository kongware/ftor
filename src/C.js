"use strict";


/**
 * @name cardinal combinator (flip arguments)
 * @type higher order function
 * @example

   const C = f => y => x => f(x) (y);

   const sub = y => x => x - y;
   const sub2 = sub(2);

   sub2(10); // 8
   sub(10) (2); // -8
   C(sub) (10) (2); // 8

 */


// (a -> b -> c) -> b -> a -> c
const C = f => y => x => f(x) (y);


// API


module.exports = C;