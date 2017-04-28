"use strict";


// dependencies


const foldl = require("../../product/array/foldl");
const foldr = require("../../product/array/foldr");
const {or} = require("./or");


/**
 * @name or of n values
 * @note logical disjunction; short circuiting; non-boolean values are allowed
 * @type list catamorphism
 * @status unstable
 * @example

   ?

 */


// [a] -> a
const orn = foldl(or) (false);


// [a] -> a
const orn_ = foldr(or) (false);


// API


module.exports = {orn, orn_};