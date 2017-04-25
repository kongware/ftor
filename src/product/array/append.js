"use strict";


/**
 * @name append
 * @type operator function
 * @example

   ?

 */


// [a] -> a -> [a]
const append = xs => x => xs.concat([x]);


// a -> [a] -> [a]
const append_ = x => xs => xs.concat([x]);


// API


module.exports = {append, append_};