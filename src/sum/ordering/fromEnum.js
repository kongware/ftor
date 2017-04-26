"use strict";


/**
 * @name from enumeration
 * @type first order function
 * @example

   fromEnum(LT); // 0
   fromEnum(EQ); // 1
   fromEnum(GT); // 2

 */


// Ordering -> Number
const fromEnum = ({tag}) => ({LT: 0, EQ: 1, GT: 2})[tag];


// API


module.exports = fromEnum;