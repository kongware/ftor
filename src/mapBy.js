"use strict";


/**
 * @name generic map by type
 * @type higher order function
 * @example
 *

   ?

 */


// Functor f => (a -> b) -> f a -> f b
const mapBy = f => t => t.type.map(f) (t);


// API


module.exports = mapBy