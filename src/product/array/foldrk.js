"use strict";


/**
 * @name fold right CPS
 * @note needs a reducer in CPS, i as 3rd argument is optional
 * @type higher order function
 * @example

   ?
 
 */


// (a -> b -> b) -> b -> [a] -> b
const foldrk = f => acc => xs => {
  const aux = (acc, i) => i < 0
   ? acc
   : f(xs[i]) (acc, i) (acc => aux(acc, i - 1));

  return aux(acc, xs.length - 1);
};


// API


module.exports = foldrk;