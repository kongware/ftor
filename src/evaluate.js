"use strict";


/**
 * @name evaluate
 * @type first order function
 * @status experimental
 * @example

   const evaluate = r => typeof r === "function" && r.length === 0 ? r() : r;
   const take = n => xs => n === 0 ? [] : [xs[0], take(n - 1) (evaluate(xs[1]))];
   const repeat = x => [x, () => repeat(x)];

   take(3) (repeat("x")); // ["x", ["x", ["x", []]]]

 */


// a -> b
const evaluate = r => typeof r === "function" && r.length === 0 ? r() : r;


// API


module.exports = evaluate;