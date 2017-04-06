"use strict";


/**
 * @name sequence
 * @type higher order function
 * @example
 *

   const succ = x => String.fromCharCode(x.charCodeAt(0) + 1);
   sequence(succ) ("b", "f"); // ["b", "c", "d", "e", "f"]

 */


// Ord a => (a -> b) ->  a -> a -> [a]
const sequence = stepper => x => y => {
  const aux = (acc, z) => z <= y
   ? aux(acc.concat(z), stepper(z))
   : acc;

  return aux([], x);
};


// API


module.exports = sequence;