"use strict";


/**
 * @name right paramorphism CPS
 * @note needs a reducer CPS
 * @type higher order function
 * @example

   ?
 
 */


// (a -> [a] -> b -> b) -> b -> [a] -> b
const parark = f => acc => xs => {
  const aux = (acc, head, tail) => head === undefined
   ? acc
   : f(head) (tail) (acc) (acc => aux(acc, tail[tail.length - 1], tail.slice(0, -1)));

  return aux(acc, xs[xs.length - 1], xs.slice(0, -1));
};


// API


module.exports = parark;