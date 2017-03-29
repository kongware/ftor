"use strict";


/**
 * @name n-tuple
 * @type variadic constructor
 * @example
 *

   Tuple(1, 2, 3) ((...args) => args.len); // 3
 
 */


// ?
const Tuple = (...args) => f => f(...args);


// API


module.exports = Tuple;