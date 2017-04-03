"use strict";


/**
 * @name generic map by
 * @type higher order function
 * @example
 *

   ?

 */


// Functor f => (a -> b) -> f a -> f b
const mapBy = f => t => t.type.map(f) (t);


// Functor f => (f a, (a -> b)) -> f b
const mapBy_ = f => t => t.type.map(f) (t);


// API


module.exports = {mapBy, mapBy_};