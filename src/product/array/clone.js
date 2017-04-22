"use strict";


/**
 * @name shallowly clone
 * @type operator function
 * @example

   const clone = xs => [].concat(xs);

   const xs = [1, 2, 3];
   const ys = clone(xs); // [1, 2, 3]
   
   console.assert(xs !== ys); // passes
 
 */


// [a] -> [a]
const clone = xs => [].concat(xs);


// API


module.exports = clone;