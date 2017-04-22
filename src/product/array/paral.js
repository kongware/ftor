"use strict";


/**
 * @name left paramorphism
 * @type higher order function
 * @example

   ?
 
 */


// (a -> [b] -> b -> a) -> a -> [b] -> a
const paral = f => acc => xs => {
  const aux = (acc, [head, ...tail]) => head === undefined
   ? acc
   : aux(f(acc) (tail) (head), tail);

  return aux(acc, xs);
};


// API


module.exports = paral;