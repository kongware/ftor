"use strict";


/**
 * @name left paramorphism CPS
 * @note needs a reducer CPS
 * @type higher order function
 * @example

   ?
 
 */


// (a -> [b] -> b -> a) -> a -> [b] -> a
const paralk = f => acc => xs => {
  const aux = (acc, [head, ...tail]) => head === undefined
   ? acc
   : f(acc) (tail) (head) (acc => aux(acc, tail));

  return aux(acc, xs);
};


// API


module.exports = paralk;