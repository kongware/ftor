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
 * @type operator function
 * @example

   ?

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

   ?

 */


// Any
Any.empty = false;


/**
 * @name concat
 * @type operator function
 * @example

   ?

 */


// [Any] -> Any
Any.concat = foldl(Any.append_) (Any.empty);


// [Any] -> Any
Any.concat_ = foldr(Any.append) (Any.empty);


// API


module.exports = Any;