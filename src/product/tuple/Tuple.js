"use strict";


/**
 * @name n-tuple
 * @type variadic data constructor
 * @example

   @see Pair
 
 */


// (*) -> ((*) -> a) -> a
const Tuple = (...args) => f => f(...args);


// API


module.exports = Tuple;