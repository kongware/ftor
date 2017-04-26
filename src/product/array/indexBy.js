"use strict";


// dependencies


const mapBy = require("../../mapBy");


/**
 * @name generalized index lens
 * @note should only modify the value of an element, not its type
 * @type first order function
 * @example

   @see ../view

 */


// Functor f => ([a] -> Number) -> (a -> f a) -> [a] -> [a]
const indexBy = g => f =>  xs => (g = g(xs), mapBy(v => Object.assign([], xs, {[g]: v})) (f(xs[g])));


// API


module.exports = indexBy;