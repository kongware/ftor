"use strict";


/**
 * @name lower then
 * @type operator function
 * @example

   ?

 */


// a -> a -> Boolean
const lt = x => y => x < y;


// a -> a -> Boolean
const lt_ = y => x => x < y;


// API


module.exports = {lt, lt_};