"use strict";


/**
 * @name apply combinator
 * @type higher order function
 * @example

   const A = f => x => f(x);
   const B = f => g => x => f(g(x));
   
   const add = y => x => x + y;
   const luckyNum = A(n => n === 7 ? "Lucky number seven!" : "You're out of luck, pal!");

   const comp = B(luckyNum) (add(4));

   comp(3); // "Lucky number seven!"
   comp(2); // "You're out of luck, pal!"

 */


// (a -> b) -> a -> b
const A = f => x => f(x);


// (a -> b -> c) -> a -> b -> c
const A2 = f => x => y => f(x) (y);


// (a -> b -> c -> d) -> a -> b -> c -> d
const A3 = f => x => y => z => f(x) (y) (z);


// API


module.exports = {A, A2, A3};