"use strict";


/**
 * @name all by
 * @note Boolean catamorphism; short circuiting
 * @type higher order function
 * @status unstable
 * @example

   ?

 */


// Foldable t => Object -> (a -> b) -> t a -> b
const allBy = Rep => f => Rep.foldlk(_ => y => k => f(y) && k(true)) (true);


// Foldable t => Object -> (a -> b) -> t a -> b
const allBy_ = Rep => f => Rep.foldrk(x => _ => k => f(x) && k(true)) (true);


// API


module.exports = {allBy, allBy_};