"use strict";


// dependencies


const {and, and_} = require("./and");
const foldl = require("../../product/array/foldl");
const foldr = require("../../product/array/foldr");


/**
 * @name All
 * @type type representative
 */


const All = {};


// Semigroup


/**
 * @name append
 * @note short circuiting
 * @type operator function
 * @example

   @see concat

 */


// All -> All -> All
All.append = and;


// All -> All -> All
All.append_ = and_;


// Monoid


/**
 * @name empty
 * @note value/thunk implementations are equivalent
 * @type constant
 * @example

   @see concat

 */


// All
All.empty = true;


/**
 * @name concat
 * @type operator function
 * @example

   const and_ = x => y => x && y;
   const foldl = f => acc => xs => xs.reduce((acc, x, i) => f(acc) (x, i), acc);

   const All = {};

   All.append_ = and_;
   All.empty = true;
   All.concat = foldl(All.append_) (All.empty);

   All.concat([true, true, true]); // true
   All.concat([true, false, true]); // false

   // implicit truthy/falsy coercion:

   All.concat([1, 2, 3, 4, 5]); // 5
   All.concat([1, 0, 3, 4, 5]); // 0

 */


// [All] -> All
All.concat = foldl(All.append_) (All.empty);


// [All] -> All
All.concat_ = foldr(All.append) (All.empty);


// API


module.exports = All;