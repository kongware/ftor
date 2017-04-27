"use strict";


// dependencies


const {or, or_} = require("./or");


/**
 * @name Any
 * @type type representative
 * @status stable
 */


const Any = {};


// Semigroup


/**
 * @name concat
 * @note short circuiting
 * @type associative binary operation (semigroup)
 * @status stable
 * @example

   const or = x => y => x || y;

   const Any = {};
   Any.concat = or;

   Any.concat(false) (true); // true
   Any.concat(false) (false); // false

   // implicit truthy/falsy coercion:

   Any.concat(0) (2); // 2
   Any.concat(1) (2); // 1

 */


// a -> a -> a
Any.concat = or;


// a -> a -> a
Any.concat_ = or_;


// Monoid


/**
 * @name empty
 * @note value/thunk implementations are equivalent
 * @type constant
 * @status stable
 * @example

   const or = x => y => x || y;

   const Any = {};
   Any.concat = or;
   Any.empty = false;

   Any.concat(true) (Any.empty); // true
   Any.concat(false) (Any.empty); // false

 */


// Boolean
Any.empty = false;


// API


module.exports = Any;