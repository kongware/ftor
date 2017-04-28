"use strict";


// dependencies


const foldl = require("../../product/array/foldl");
const foldr = require("../../product/array/foldr");


/**
 * @name any
 * @note Boolean list catamorphism; instead of some for consistency
 * @type first order function
 * @status unstable
 * @example

   ?

 */


// (a -> b) -> [a] -> b
const any = f => foldl(f) (false);


// (a -> b) -> [a] -> b
const any_ = f => foldr(f) (false);


// API


module.exports = {any, any_};