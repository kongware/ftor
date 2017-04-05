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
const index = k => f => xs => mapBy(v => Object.assign([], xs, {[k]: v})) (f(xs[k]));


// API


module.exports = index;