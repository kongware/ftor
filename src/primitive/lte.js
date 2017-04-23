"use strict";


/**
 * @name lower then or equal
 * @type operator function
 * @example

   ?

 */


// a -> a -> Boolean
const lte = y => x => x <= y;


// a -> a -> Boolean
const lte_ = x => y => x <= y;


// API


module.exports = {lte, lte_};