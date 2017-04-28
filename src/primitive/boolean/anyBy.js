"use strict";


/**
 * @name any by
 * @note Boolean catamorphism; short circuiting
 * @type higher order function
 * @status unstable
 * @example

   ?

 */


// Foldable t => Object -> (a -> b) -> t a -> b
const anyBy = Rep => f => Rep.foldlk(_ => y => k => f(y) || k(false)) (false);


// Foldable t => Object -> (a -> b) -> t a -> b
const anyBy_ = Rep => f => Rep.foldrk(x => _ => k => f(x) || k(false)) (false);


// API


module.exports = {anyBy, anyBy_};