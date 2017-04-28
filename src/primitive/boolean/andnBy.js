"use strict";


// dependencies


const foldl = require("../../product/array/foldl");
const foldr = require("../../product/array/foldr");
const {and} = require("./and");


/**
 * @name and of n values by
 * @note logical conjunction; short circuiting; works with all types through implicit type coercion
 * @type catamorphism
 * @status unstable
 * @example

   ?

 */


// Foldable t => Object -> t a -> a
const andnBy = Rep = Rep.foldl(and) (true);


// Foldable t => Object -> t a -> a
const andnBy_ = Rep = Rep.foldr(and) (true);


// API


module.exports = {andnBy, andnBy_};