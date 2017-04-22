"use strict";


/**
 * @name prepend
 * @type operator function
 * @example

   ?

 */


// a -> [a] -> [a]
const prepend = x => xs => [x].concat(xs);


// [a] -> a -> [a]
const prepend_ = xs => x => [x].concat(xs);


// API


module.exports = {prepend, prepend_};