"use strict";


// dependencies


const LT = require("../../sum/ordering/LT");
const EQ = require("../../sum/ordering/EQ");
const GT = require("../../sum/ordering/GT");


/**
 * @name compare
 * @note works with all types through explicit type cast
 * @type first order function
 * @status stable
 * @example

   const Ordering = {};
   const LT = ({type: Ordering, tag: "LT"});
   const EQ = ({type: Ordering, tag: "EQ"});
   const GT = ({type: Ordering, tag: "GT"});

   const compare = x => y => {
     x = !!x;
     y = !!y;

     return x < y ? LT
      : x > y ? GT
      : EQ;
   };

   compare(false) (true); // LT
   compare(true) (false); // GT
   compare("foo") ("bar"); // EQ

 */


// a -> a -> Ordering
const compare = x => y => {
  x = !!x;
  y = !!y;

  return x < y ? LT
   : x > y ? GT
   : EQ;
};


// a -> a -> Ordering
const compare_ = y => x => {
  x = !!x;
  y = !!y;

  return x < y ? LT
   : x > y ? GT
   : EQ;
};


// API


module.exports = {compare, compare_};