"use strict";


/**
 * @name greater then or equal
 * @type operator function
 * @example

   ?

 */


// a -> a -> Boolean
const gte = y => x => x >= y;


// a -> a -> Boolean
const gte_ = x => y => x >= y;


// API


module.exports = {gte, gte_};