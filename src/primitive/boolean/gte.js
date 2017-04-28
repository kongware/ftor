"use strict";


/**
 * @name greater than or equal
 * @note works with all types through explicit type cast
 * @type first order function
 * @status unstable
 * @example

   ?

 */


// a -> a -> Boolean
const gte = x => y => !!x >= !!y;


// a -> a -> Boolean
const gte_ = y => x => !!x >= !!y;


// API


module.exports = {gte, gte_};