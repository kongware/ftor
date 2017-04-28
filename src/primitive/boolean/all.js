"use strict";


// dependencies


const foldlk = require("../../product/array/foldlk");
const foldrk = require("../../product/array/foldrk");


/**
 * @name all
 * @note Boolean list catamorphism
 * @type first order function
 * @status unstable
 * @example

   ?

 */


// (a -> b) -> [a] -> b
const all = f => foldlk(x => y => k => f(y) ? k(true) : false) (true);


// (a -> b) -> [a] -> b
const all_ = f => foldrk(x => y => k => f(x) ? k(true) : false) (true);


// API


module.exports = {all, all_};