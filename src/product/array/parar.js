"use strict";


/**
 * @name right paramorphism
 * @type higher order function
 * @example

   ?
 
 */


// (a -> [a] -> b -> b) -> b -> [a] -> b
const parar = f => acc => xs => {
  const aux = (acc, head, tail) => head === undefined
   ? acc
   : aux(f(head) (tail) (acc), tail[tail.length - 1], tail.slice(0, -1));

  return aux(acc, xs[xs.length - 1], xs.slice(0, -1));
};


// API


module.exports = parar;