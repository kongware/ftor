"use strict";


// dependencies


const {A} = require("../../A");
const foldrk = require("../../product/array/foldrk");


/**
 * @name all
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

   const all = f => xs => xs.every(A(f));

   all(even) ([2, 4, 6, 8, 10]); // true

   // implicit type coercion:

   all(I) (["foo", "bar", "baz"]); // true
   all(I) (["foo", "", "baz"]); // false

 */


// (a -> b) -> [a] -> b
const all = f => xs => xs.every(A(f));


// (a -> b) -> [a] -> b
const all_ = f => foldrk(x => _ => k => f(x) && k(true)) (true);


// API


module.exports = {all, all_};