"use strict";


// dependencies


const foldl = require("../../product/array/foldl");
const foldr = require("../../product/array/foldr");
const {and} = require("./and");


/**
 * @name and of n values
 * @note logical conjunction; short circuiting; works with all types through implicit type coercion
 * @type list catamorphism
 * @status unstable
 * @example

   ?

 */


// [a] -> a
const andn = foldl(and) (true);


// [a] -> a
const andn_ = foldr(and) (true);


// API


module.exports = {andn, andn_};