"use strict";


// dependencies


const mapBy = require("../../mapBy");


/**
 * @name index by function lens
 * @type operator function
 * @example
 *

   ?

 */


// Functor f => (Array -> Number) -> (a -> f b) -> Array -> Array
const indexBy = g => f => xs => mapBy(v => Object.assign([], xs, {[k]: v})) (f(xs[g(xs)]));


// API


module.exports = indexBy;