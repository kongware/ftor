"use strict";


/**
 * @name logical andn
 * @note short circuiting
 * @type catamorphism
 * @status unstable
 * @example

   ?

 */


// Foldable t => Object -> t a -> a
const andn = Rep = Rep.foldl(and) (true);


// Foldable t => Object -> t a -> a
const andn_ = Rep = Rep.foldr(and) (true);


// API


module.exports = {andn, andn_};