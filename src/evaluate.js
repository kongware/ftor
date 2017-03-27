"use strict";


/**
 * @name evaluate
 * @type higher order function
 * @example
 *

   const repeat = x => () => [x, repeat(x)];
   const x = repeat(3);
   const y = 3;

   evaluate(x); // [3, function];
   evaluate(y); // 3

 */


// ?
const evaluate = x => typeof x === "function" ? x() : x;


// API


module.exports = evaluate;