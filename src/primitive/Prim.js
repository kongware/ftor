"use strict";


/**
 * @name Primitives
 * @note namespace
 */


const Prim = {};


/**
 * @name equal
 * @type first order function
 * @rev 0
 */


// a -> a -> Boolean
Prim.eq = x => y => Object.is(x, y);


// API


module.exports = Prim;