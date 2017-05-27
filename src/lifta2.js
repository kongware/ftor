"use strict";


/**
 * @name applicative lift
 * @type higher order function
 * @status stable
 * @example

  ???

 */


// Applicative f => (a -> b -> c) -> f a -> f b -> f c
const lifta2 = (map, ap) => f => tx => ty => ap(map(f) (tx)) (ty);


// Applicative f => (a -> b -> c -> d) -> f a -> f b -> f c -> f d
const lifta3 = (map, ap) => f => tx => ty => tz => ap(ap(map(f) (tx)) (ty)) (tz);


// API


module.exports = {lifta2, lifta3};