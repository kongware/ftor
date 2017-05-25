"use strict";


/**
 * @name lift 2
 * @note generic lift for both applicative and monadic values
 * @type higher order function
 * @status unstable
 * @example

  ???

 */


// Applicative f => (a -> b -> c) -> f a -> f b -> f c
const lift2 = (map, ap) => f => tx => ty => ap(map(f) (tx)) (ty);


// API


module.exports = lift2;