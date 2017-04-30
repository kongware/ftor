"use strict";


// dependencies


const fromEnum = require("./fromEnum");


/**
 * @name lower than or equal
 * @type first order function
 * @status stable
 * @example

   const Ordering = {};
   const LT = ({type: Ordering, tag: "LT"});
   const EQ = ({type: Ordering, tag: "EQ"});
   const GT = ({type: Ordering, tag: "GT"});

   const fromEnum = ({tag}) => ({LT: 0, EQ: 1, GT: 2})[tag];
   const lte = t1 => t2 => fromEnum(t1) <= fromEnum(t2);

   lte(EQ) (GT); // true
   lte(GT) (GT); // true

 */


// Ordering -> Ordering -> Boolean
const lte = t1 => t2 => fromEnum(t1) <= fromEnum(t2);


// Ordering -> Ordering -> Boolean
const lte_ = t2 => t1 => fromEnum(t1) <= fromEnum(t2);


// API


module.exports = {lte, lte_};