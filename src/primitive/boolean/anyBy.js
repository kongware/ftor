"use strict";


// dependencies


const foldl = require("../../product/array/foldl");
const foldr = require("../../product/array/foldr");


/**
 * @name any by
 * @note Boolean catamorphism; short circuiting
 * @type higher order function
 * @status unstable
 * @example

   ?

 */


// Foldable t => Object -> (a -> b) -> t a -> b
const anyBy = Rep => f => foldrk(_ => y => k => f(y) || k(false)) (false);


// Foldable t => Object -> (a -> b) -> t a -> b
const anyBy_ = Rep => f => foldrk(x => _ => k => f(x) || k(false)) (false);


// API


module.exports = {anyBy, anyBy_};