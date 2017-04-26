"use strict";


// dependencies


const {or, or_} = require("./or");
const foldl = require("../../product/array/foldl");
const foldr = require("../../product/array/foldr");


/**
 * @name Any
 * @type type representative
 * @status stable
 */


const Any = {};


// Semigroup


/**
 * @name append
 * @note short circuiting
 * @type associative binary operation (semigroup)
 * @example

   @see concat

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
 * @type first order function
 * @example

   const or = x => y => x || y;
   const or_ = y => x => x || y;

   const foldl = f => acc => xs => xs.reduce((acc, x, i) => f(acc) (x, i), acc);
   const foldr = f => acc => xs => xs.reduceRight((acc, x, i) => f(x) (acc, i), acc);

   const Any = {};

   Any.append = or;
   Any.append_ = or_;
   Any.empty = false;
   Any.concat = foldl(Any.append) (Any.empty);
   Any.concat_ = foldr(Any.append_) (Any.empty);

   Any.concat([false, false, false]); // false
   Any.concat([false, true, false]); // ture

   // implicit truthy/falsy coercion:

   Any.concat([null, 0, 0, 0, ""]); // ""
   Any.concat([null, 2, 0, 0, ""]); // 2

   Any.concat_([null, 0, 0, 0, ""]); // null
   Any.concat_([null, 2, 0, 0, ""]); // 2

 */


// [Any] -> Any
Any.concat = foldl(Any.append_) (Any.empty);


// [Any] -> Any
Any.concat_ = foldr(Any.append) (Any.empty);


// API


module.exports = Any;