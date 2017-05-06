"use strict";


/**
 * @name eager
 * @type higher order function
 * @status experimental
 * @example

   const eager = f => (...args) => {
     let g = f(...args);
     
     while (typeof g === "function" && g.length === 0) g = g();
     return g;
   }

   const repeat = n => f => x => {
     const aux = (x, n) => n === 0 ? x : () => aux(f(x), n - 1);
     return eager(aux) (x, n);
   };

   const inc = x => x + 1;

   repeat(1e6) (inc) (0); // 1000000

 */


// ((*) -> () -> a) -> (*) -> a
const eager = f => (...args) => {
  let g = f(...args);
  
  while (typeof g === "function" && g.length === 0) g = g();
  return g;
};


// API


module.exports = eager;