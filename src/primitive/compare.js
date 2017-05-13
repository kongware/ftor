"use strict";


/**
 * @name compare
 * @type first order function
 * @status stable
 * @example

   const compare = x => y => x < y ? -1 : y < x ? 1 : 0;
   compare(2) (3); // -1

 */


// Ord a => a -> a -> Ordering
const compare = x => y => x < y ? -1 : y < x ? 1 : 0;


// Ord a => a -> a -> Ordering
const compare_ = y => x => x < y ? -1 : y < x ? 1 : 0;


// API


module.exports = {compare, compare_};