"use strict";


// dependencies


const {and, and_} = require("./and");


/**
 * @name All
 * @type type representative
 * @status unstable
 */


const All = {};


// Semigroup


/**
 * @name concat
 * @note logical conjunction; short circuiting; non-boolean values are allowed
 * @type associative binary operation (semigroup)
 * @status stable
 * @example

   const and = x => y => x && y;

   const All = {};
   All.concat = and;

   All.concat(true) (true); // true
   All.concat(true) (false); // false

   // implicit truthy/falsy coercion:

   All.concat(1) (2); // 2
   All.concat(0) (2); // 0

 */


// a -> a -> a
All.concat = and;


// a -> a -> a
All.concat_ = and_;


// Monoid


/**
 * @name empty
 * @type constant
 * @status unstable
 * @example

   ?

 */


// Boolean
All.empty = true;


// API


module.exports = All;