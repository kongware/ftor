"use strict";


/**
 * @name fold left CPS
 * @note needs a reducer in CPS; i as 3rd argument is optional
 * @type higher order function
 * @example

   ?
 
 */


// (a -> b -> a) -> a -> [b] -> a
const foldlk = f => acc => xs => {
  const aux = (acc, i) => xs.length === i
   ? acc
   : f(acc) (xs[i], i) (acc => aux(acc, i + 1));

  return aux(acc, 0);
};


// API


module.exports = foldlk;