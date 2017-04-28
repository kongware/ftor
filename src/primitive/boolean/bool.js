"use strict";


/**
 * @name bool
 * @type Boolean catamorphism
 * @status stable
 * @example

   const bool = x => y => z => z ? y : x;
   const eq = x => y => Object.is(x, y);

   bool("foo") ("bar") (eq(2) (2)); // "bar"

 */


// a -> a -> Boolean -> a
const bool = x => y => z => z ? y : x;


// API


module.exports = bool;