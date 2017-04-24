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
 * @type operator function
 * @example

   ?

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

   ?

 */


// All
All.empty = true;


/**
 * @name concat
 * @type operator function
 * @example

   ?

 */


// [All] -> All
All.concat = foldl(All.append_) (All.empty);


// [All] -> All
All.concat_ = foldr(All.append) (All.empty);


// API


module.exports = All;