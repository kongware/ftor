"use strict";


/**
 * @name evaluate
 * @type higher order function
 * @example

   ?

 */


// ?
const evaluate = f => {
  while (typeof f === "function" && f.length === 0) f = f();
  return f;
}


// API


module.exports = evaluate;