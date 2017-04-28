"use strict";


// dependencies


const foldl = require("../../product/array/foldl");
const foldr = require("../../product/array/foldr");


/**
 * @name all
 * @note Boolean list catamorphism; instead of every for consistency
 * @type first order function
 * @status unstable
 * @example

   ?

 */


// (a -> b) -> [a] -> b
const all = f => foldl(f) (true);


// (a -> b) -> [a] -> b
const all_ = f => foldr(f) (true);


// API


module.exports = {all, all_};