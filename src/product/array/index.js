"use strict";


// dependencies


const mapBy = require("../../mapBy");


/**
 * @name index lens
 * @note should only modify the value of an element, not its type
 * @type operator function
 * @example

   @see ../view

 */


// Functor f => Number -> (a -> f a) -> [a] -> [a]
const index = i => f => xs => mapBy(x => Object.assign([], xs, {[i]: x})) (f(xs[i]));


// API


module.exports = index;