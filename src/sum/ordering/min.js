"use strict";


// dependencies


const fromEnum = require("./fromEnum");


/**
 * @name minimum
 * @note commutative
 * @type first order function
 * @status stable
 * @example

   const Ordering = {};
   const LT = ({type: Ordering, tag: "LT"});
   const EQ = ({type: Ordering, tag: "EQ"});
   const GT = ({type: Ordering, tag: "GT"});

   const fromEnum = ({tag}) => ({LT: 0, EQ: 1, GT: 2})[tag];
   const min = t1 => t2 => fromEnum(t1) <= fromEnum(t2) ? t1 : t2;

   min(GT) (LT); // LT
   min(EQ) (GT); // EQ

 */


// Ordering -> Ordering -> Ordering
const min = t1 => t2 => fromEnum(t1) <= fromEnum(t2) ? t1 : t2;


// API


module.exports = min;