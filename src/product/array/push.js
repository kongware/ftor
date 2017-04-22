"use strict";


/**
 * @name destructive pop
 * @note destructive operation!!!
 * @type operator function
 * @example

   ?
 
 */


// a -> [a] -> [a]
const push = x => xs => (xs.push(x), xs);


// [a] -> a -> [a]
const push_ = x => xs => (xs.push(x), xs);


// API


module.exports = {push, push_};