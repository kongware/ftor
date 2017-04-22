"use strict";


/**
 * @name slice
 * @type operator function
 * @example

   ?

 */


// [a] -> [a]
const slice = x => y => xs => xs.slice(x, y);


// [a] -> a -> [a]
const slice_ = xs => x => y => xs.slice(x, y);


// API


module.exports = {slice, slice_};