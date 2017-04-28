"use strict";


// dependencies


const {and, and_} = require("./and");


/**
 * @name All
 * @type type representative
 * @status stable
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
 * @status stable
 * @example

   const foldl = f => acc => xs => xs.reduce((acc, x, i) => f(acc) (x, i), acc);
   const and = x => y => x && y;

   const All = {};
   All.concat = and;
   All.empty = true;

   const fold = foldl(All.concat) (All.empty);

   fold([true, true, true]); // true

 */


// Boolean
All.empty = true;


// API


module.exports = All;