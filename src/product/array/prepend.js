"use strict";


/**
 * @name prepend
 * @type first order function
 * @example

   ?

 */


// [a] -> a -> [a]
const prepend = xs => x => [x].concat(xs);


// a -> [a] -> [a]
const prepend_ = x => xs => [x].concat(xs);


// API


module.exports = {prepend, prepend_};