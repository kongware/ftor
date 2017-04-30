"use strict";


// dependencies


const EQ = require("./EQ");
const GT = require("./GT");
const LT = require("./LT");


/**
 * @name compare
 * @type first order function
 * @status stable
 * @example

   const Ordering = {};
   const LT = ({type: Ordering, tag: "LT"});
   const EQ = ({type: Ordering, tag: "EQ"});
   const GT = ({type: Ordering, tag: "GT"});

   const fromEnum = ({tag}) => ({LT: 0, EQ: 1, GT: 2})[tag];
   
   const compare = t1 => t2 => {
     const x = fromEnum(t1),
      y  = fromEnum(t2);

     return x < y ? LT
      : x > y ? GT
      : EQ;
   };

   compare(EQ) (GT); // LT
   compare(GT) (GT); // EQ
   compare(GT) (LT); // GT

 */


// Ordering -> Ordering -> Ordering
const compare = t1 => t2 => {
  const x = fromEnum(t1),
   y  = fromEnum(t2);

  return x < y ? LT
   : x > y ? GT
   : EQ;
};


// Ordering -> Ordering -> Ordering
const compare_ = t2 => t1 => {
  const x = fromEnum(t1),
   y  = fromEnum(t2);

  return x < y ? LT
   : x > y ? GT
   : EQ;
};


// API


module.exports = {compare, compare_};