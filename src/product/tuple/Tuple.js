"use strict";


/**
 * @name n-tuple
 * @type variadic data constructor
 * @example

   Tuple(1, 2, 3) (len); // 3
 
 */


// (*) -> ((*) -> a) -> a
const Tuple = (...args) => f => f(...args);


// API


module.exports = Tuple;