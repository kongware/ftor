"use strict";


/**
 * @name ifElse
 * @note catamorphism analogous to foldr
 * @type operator function
 * @example

   ?

 */


// a -> a -> Boolean -> a
const ifElse = x => y => z => z ? y : x;


// Boolean -> a -> a -> a
const ifElse_ = z => x => y => z ? y : x;


// API


module.exports = {ifElse, ifElse_};