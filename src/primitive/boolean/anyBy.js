"use strict";


// dependencies


const foldl = require("../../product/array/foldl");
const foldr = require("../../product/array/foldr");


/**
 * @name any by
 * @note Boolean catamorphism
 * @type first order function
 * @status unstable
 * @example

   ?

 */


// Foldable t => Object -> (a -> b) -> t a -> b
const anyBy = Rep => f => Rep.foldl(f) (false);


// Foldable t => Object -> (a -> b) -> t a -> b
const anyBy_ = Rep => f => Rep.foldr(f) (false);


// API


module.exports = {anyBy, anyBy_};