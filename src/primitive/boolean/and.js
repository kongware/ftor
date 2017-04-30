"use strict";


// dependencies


const {concat, concat_} = require("./All");


/**
 * @name and
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
const and = concat;


// a -> a -> a
const and_ = concat;


// API


module.exports = {and, and_};