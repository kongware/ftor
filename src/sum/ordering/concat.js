"use strict";


/**
 * @name concatenate
 * @type operator function
 * @example

   concat(LT) (GT); // LT
   concat(EQ) (GT); // GT
   concat(EQ) (EQ); // EQ

 */


// Ordering -> Ordering -> Ordering
const concat = t2 => ({tag}) => ({LT, EQ: t2, GT})[tag];


// API


module.exports = concat;