"use strict";


/**
 * @name lower than
 * @note works with all types through explicit type cast
 * @type first order function
 * @status unstable
 * @example

   ?

 */


// a -> a -> Boolean
const lt = x => y => !!x < !!y;


// a -> a -> Boolean
const lt_ = y => x => !!x < !!y;


// API


module.exports = {lt, lt_};