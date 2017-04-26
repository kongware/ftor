"use strict";


// dependencies


const {and, and_} = require("./and");
const foldl = require("../../product/array/foldl");
const foldr = require("../../product/array/foldr");


/**
 * @name All
 * @type type representative
 * @status stable
 */


const All = {};


// Semigroup


/**
 * @name append
 * @note short circuiting
 * @type associative binary operation (semigroup)
 * @status stable
 * @example

   @see concat

 */


// a -> a -> a
All.append = and;


// a -> a -> a
All.append_ = and_;


// Monoid


/**
 * @name empty
 * @note value/thunk implementations are equivalent
 * @type constant
 * @status stable
 * @example

   @see concat

 */


// All
All.empty = true;


/**
 * @name concat
 * @type first order function
 * @status stable
 * @example

   const and = x => y => x && y;
   const and_ = y => x => x && y;

   const foldl = f => acc => xs => xs.reduce((acc, x, i) => f(acc) (x, i), acc);
   const foldr = f => acc => xs => xs.reduceRight((acc, x, i) => f(x) (acc, i), acc);

   const All = {};

   All.append = and;
   All.append_ = and_;
   All.empty = true;
   All.concat = foldl(All.append) (All.empty);
   All.concat_ = foldr(All.append_) (All.empty);

   All.concat([true, true, true]); // true
   All.concat([true, false, true]); // false

   // implicit truthy/falsy coercion:

   All.concat([1, 2, 3, 4, 5]); // 5
   All.concat([1, 0, 3, 4, 5]); // 0

   All.concat_([1, 2, 3, 4, 5]); // 1
   All.concat_([1, 0, 3, 4, 5]); // 0

 */


// [a] -> a
All.concat = foldl(All.append) (All.empty);


// [a] -> a
All.concat_ = foldr(All.append_) (All.empty);


// API


module.exports = All;