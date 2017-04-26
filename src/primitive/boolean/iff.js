"use strict";


/**
 * @name if and only if
 * @note logical equality; in an untyped language simply eq; commutative
 * @type associative binary operation (semigroup)
 * @status stable
 * @example

   const eq = x => y => Object.is(x, y);
   const iff = eq;

   iff(true) (true); // true
   iff(true) (false); // false
   iff(false) (true); // false
   iff(false) (false); // true

 */


// Boolean -> Boolean -> Boolean
const iff = eq;


// API


module.exports = iff;