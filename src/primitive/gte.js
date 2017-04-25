"use strict";


/**
 * @name greater then or equal
 * @type operator function
 * @example

   ?

 */


// a -> a -> Boolean
const gte = x => y => x >= y;


// a -> a -> Boolean
const gte_ = y => x => x >= y;


// API


module.exports = {gte, gte_};