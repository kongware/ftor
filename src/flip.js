"use strict";


/**
 * @name flip
 * @type higher order function
 * @example

   const flip = f => y => x => f(x) (y);

   const sub = y => x => x - y;
   const sub2 = sub(2);

   sub2(10); // 8
   sub(10) (2); // -8
   flip(sub) (10) (2); // 8

 */


// (a -> b -> c) -> b -> a -> c
const flip = f => y => x => f(x) (y);


// (a -> b -> c -> d) -> a -> c -> b -> d
const flip3 = f => z => x => y => f(x) (y) (z);


// API


module.exports = {flip, flip3};