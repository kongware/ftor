"use strict";


/**
 * @name maximal value
 * @note works with all types through explicit type cast
 * @type first order function
 * @status unstable
 * @example

   ?

 */


// a -> a -> a
const max = x => y => !!x >= !!y ? x : y;


// API


module.exports = max;