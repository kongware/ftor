"use strict";


// dependencies


const {A} = require("../../A");
const foldrk = require("../../product/array/foldrk");


/**
 * @name any
 * @note Boolean list catamorphism; short circuiting
 * @type higher order function
 * @status stable
 * @example

   const A = f => x => f(x);

   const foldrk = f => acc => xs => {
     const aux = (acc, i) => i < 0
      ? acc
      : f(xs[i]) (acc, i) (acc => aux(acc, i - 1));

     return aux(acc, xs.length - 1);
   };

   const even = x => Math.floor(x) === x && (x & 1) === 0;
   const I = x => x;

   const any = f => xs => xs.some(A(f));
   const any_ = f => foldrk(x => _ => k => f(x) || k(false)) (false);

   any(even) ([1, 2, 3, 5]); // true

   // implicit type coercion:

   any(I) (["", "", ""]); // false
   any(I) (["foo", "", ""]); // true

 */


// (a -> b) -> [a] -> b
const any = f => xs => xs.some(A(f));


// (a -> b) -> [a] -> b
const any_ = f => foldrk(x => _ => k => f(x) || k(false)) (false);


// API


module.exports = {any, any_};