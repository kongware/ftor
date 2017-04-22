"use strict";


/**
 * @name initial elements
 * @type operator function
 * @example

   const init = xs => xs.slice(0, -1);
   init([1, 2, 3]); // [1, 2]
 
 */


// [a] -> [a]
const init = xs => xs.slice(0, -1);


// API


module.exports = init;