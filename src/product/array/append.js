"use strict";


/**
 * @name append
 * @type operator function
 * @example

   ?

 */


// a -> [a] -> [a]
const append = x => xs => xs.concat([x]);


// [a] -> a -> [a]
const append_ = xs => x => xs.concat([x]);


// API


module.exports = {append, append_};