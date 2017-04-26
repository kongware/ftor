"use strict";


/**
 * @name implies
 * @note logical implication: if x is true y must be true, otherwise y can be everything
 * @type associative binary operation (semigroup)
 * @status stable
 * @example

   const implies = x => y => !x || y;

   implies(true) (true); // true
   implies(true) (false); // false
   implies(false) (true); // true
   implies(false) (false); // true

 */


// Boolean -> Boolean -> Boolean
const implies = x => y => !x || y;


// Boolean -> Boolean -> Boolean
const implies_ = y => x => !x || y;


// API


module.exports = {implies, implies_};