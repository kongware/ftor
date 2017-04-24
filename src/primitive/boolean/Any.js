"use strict";


// dependencies


const {or, or_} = require("./or");
const foldl = require("../../product/array/foldl");
const foldr = require("../../product/array/foldr");


/**
 * @name Any
 * @type type representative
 */


const Any = {};


// Semigroup


/**
 * @name append
 * @note short circuiting
 * @type operator function
 * @example

   @see or

 */


// Any -> Any -> Any
Any.append = or;


// Any -> Any -> Any
Any.append_ = or_;


// Monoid


/**
 * @name empty
 * @note value/thunk implementations are equivalent
 * @type constant
 * @example

   @see concat

 */


// Any
Any.empty = false;


/**
 * @name concat
 * @type operator function
 * @example

   const or_ = x => y => x || y;
   const foldl = f => acc => xs => xs.reduce((acc, x, i) => f(acc) (x, i), acc);

   const Any = {};

   Any.append_ = or_;
   Any.empty = false;
   Any.concat = foldl(Any.append_) (Any.empty);

   Any.concat([false, false, false]); // false
   Any.concat([false, true, false]); // true

   // implicit truthy/falsy coercion:

   Any.concat([0, 0, 0, 0, 0]); // 0
   Any.concat([0, 2, 0, 0, 0]); // 2

 */


// [Any] -> Any
Any.concat = foldl(Any.append_) (Any.empty);


// [Any] -> Any
Any.concat_ = foldr(Any.append) (Any.empty);


// API


module.exports = Any;