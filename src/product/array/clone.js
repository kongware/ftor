"use strict";


/**
 * @name shallowly clone
 * @type operator function
 * @example
 *

   const xs = [1, 2, 3];
   const ys = clone(xs); // [1, 2, 3]
   xs === ys; // false
 
 */


// [a] -> [a]
const clone = xs => [].concat(xs);


// API


module.exports = clone;