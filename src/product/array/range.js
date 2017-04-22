"use strict";


/**
 * @name range
 * @note only for non-recursive stepper functions
 * @type higher order function
 * @example

   const range = x => pred => f => {
     const aux = (x, acc) => {
       return pred(x) ? aux(f(x), acc.concat(x)) : acc;
     }

     return pred(x) ? aux(f(x), [x]): [];
   };

   const lte = y => x => x <= y;
   const sqr = x => x * x;

   range(2) (lte(256)) (sqr); // [2, 4, 16, 256]

 */


// a -> (a -> Boolean) -> (a -> b) -> [b]
const range = x => pred => f => {
  const aux = (x, acc) => {
    return pred(x) ? aux(f(x), acc.concat(x)) : acc;
  }

  return pred(x) ? aux(f(x), [x]): [];
};


// API


module.exports = range;