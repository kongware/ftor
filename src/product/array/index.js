"use strict";


// dependencies


const mapBy = require("../../mapBy");


/**
 * @name index lens
 * @type operator function
 * @example
 *

   @see ../view

 */


// Functor f => Number -> (a -> f b) -> Array -> Array
const index = i => f => xs => mapBy(v => Object.assign([], xs, {[i]: v})) (f(xs[i]));


// API


module.exports = index;