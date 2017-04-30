"use strict";


// dependencies


const {concat, concat_} = require("./Any");


/**
 * @name or
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
const or = concat;


// a -> a -> a
const or_ = concat_;


// API


module.exports = {or, or_};