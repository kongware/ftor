"use strict";


/**
 * @name All
 * @note combined type and constructor; primitive
 * @type type representative
 * @kind *
 * @status stable
 */


// constructor


/**
 * @name All
 * @note lambda to prevent new-operator use
 * @type constructor
 * @status stable
 */


const All = x => Boolean(x);


// Semigroup


/**
 * @name concat
 * @note logical conjunction; short circuiting; works with all types through implicit type coercion
 * @type associative binary operation (semigroup)
 * @status stable
 * @example

   const and = x => y => x && y;

   and(true) (true); // true
   and(true) (false); // false

   and(1) (2); // 2
   and(0) (2); // 0

 */


// a -> a -> a
const concat = x => y => x && y;


// a -> a -> a
const concat_ = y => x => x && y;


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