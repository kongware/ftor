"use strict";


/**
 * @name lower than or equal
 * @note works with all types through explicit type cast
 * @type first order function
 * @status unstable
 * @example

   ?

 */


// a -> a -> Boolean
const lte = x => y => !!x <= !!y;


// a -> a -> Boolean
const lte_ = y => x => !!x <= !!y;


// API


module.exports = {lte, lte_};