"use strict";


/**
 * @name lower then or equal
 * @type operator function
 * @example

   ?

 */


// a -> a -> Boolean
const lte = x => y => x <= y;


// a -> a -> Boolean
const lte_ = y => x => x <= y;


// API


module.exports = {lte, lte_};