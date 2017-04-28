"use strict";


// dependencies


const foldl = require("../../product/array/foldl");
const foldr = require("../../product/array/foldr");


/**
 * @name all by
 * @note Boolean catamorphism
 * @type first order function
 * @status unstable
 * @example

   ?

 */


// Foldable t => Object -> (a -> b) -> t a -> b
const allBy = Rep => f => Rep.foldl(f) (true);


// Foldable t => Object -> (a -> b) -> t a -> b
const allBy_ = Rep => f => Rep.foldr(f) (true);


// API


module.exports = {allBy, allBy_};