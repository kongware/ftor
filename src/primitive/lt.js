"use strict";


/**
 * @name lower then
 * @type operator function
 * @example

   ?

 */


// a -> a -> Boolean
const lt = y => x => x < y;


// a -> a -> Boolean
const lt_ = x => y => x < y;


// API


module.exports = {lt, lt_};