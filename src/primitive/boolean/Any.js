"use strict";


/**
 * @name Any
 * @note combined type and constructor; primitive
 * @type type representative
 * @kind *
 * @status stable
 */


// constructor


/**
 * @name Any
 * @note lambda to prevent new-operator use
 * @type constructor
 * @status stable
 */


const Any = x => Boolean(x);


// Semigroup


/**
 * @name concat
 * @note logical disjunction; short circuiting; works with all types through implicit type coercion
 * @type associative binary operation (semigroup)
 * @status stable
 * @example

   const or = x => y => x || y;

   or(false) (true); // true
   or(false) (false); // false

   // implicit truthy/falsy coercion:

   or(0) (2); // 2
   or(1) (2); // 1

 */


// a -> a -> a
const concat = x => y => x || y;


// a -> a -> a
const concat_ = y => x => x || y;


// Monoid


/**
 * @name empty
 * @type constant
 * @status stable
 * @example

   const foldl = f => acc => xs => xs.reduce((acc, x, i) => f(acc) (x, i), acc);
   const or = x => y => x || y;

   const Any = {};
   Any.concat = or;
   Any.empty = false;

   const fold = foldl(Any.concat) (Any.empty);

   fold([false, true, false]); // true

 */


// Boolean
Any.empty = false;


// API


module.exports = Any;