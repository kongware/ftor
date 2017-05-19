"use strict";


/**
 * @name equal
 * @note commutative
 * @type first order function
 * @status stable
 * @example

  const eq = x => y => Object.is(x, y);
  const eqFoo = eq("foo");

  eqFoo("foo"); // true
  eqFoo("bar"); // false

 */


// a -> a -> Boolean
const eq = x => y => Object.is(x, y);


// API


module.exports = eq;