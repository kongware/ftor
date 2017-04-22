"use strict";


/**
 * @name head
 * @note yields undefined when list is empty
 * @type operator function
 * @example

   ?
 
 */


// [a] -> a
const head = xs => xs[0];


// API


module.exports = head;