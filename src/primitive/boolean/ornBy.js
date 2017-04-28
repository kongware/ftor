"use strict";


// dependencies


const foldl = require("../../product/array/foldl");
const foldr = require("../../product/array/foldr");
const {or} = require("./or");


/**
 * @name or of n values by
 * @note logical disjunction; short circuiting; non-boolean values are allowed
 * @type catamorphism
 * @status unstable
 * @example

   ?

 */


// Foldable t => Object -> t a -> a
const ornBy = Rep = Rep.foldl(or) (false);


// Foldable t => Object -> t a -> a
const ornBy_ = Rep = Rep.foldr(or) (false);


// API


module.exports = {ornBy, ornBy_};