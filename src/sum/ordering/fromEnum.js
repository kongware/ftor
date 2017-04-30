"use strict";


/**
 * @name from enumeration
 * @type first order function
 * @status stable
 * @example

   const Ordering = {};
   const LT = ({type: Ordering, tag: "LT"});
   const EQ = ({type: Ordering, tag: "EQ"});
   const GT = ({type: Ordering, tag: "GT"});

   const fromEnum = ({tag}) => ({LT: 0, EQ: 1, GT: 2})[tag];
   
   fromEnum(LT); // 0
   fromEnum(EQ); // 1
   fromEnum(GT); // 2

 */


// Ordering -> Number
const fromEnum = ({tag}) => ({LT: 0, EQ: 1, GT: 2})[tag];


// API


module.exports = fromEnum;