"use strict";


// dependencies


const EQ = require("./EQ");
const GT = require("./GT");


/**
 * @name successor
 * @type first order function
 * @status stable
 * @example

   const Ordering = {};
   const LT = ({type: Ordering, tag: "LT"});
   const EQ = ({type: Ordering, tag: "EQ"});
   const GT = ({type: Ordering, tag: "GT"});

   const succ = ({tag}) => ({
     LT: EQ,
     EQ: GT,
     GT: null
   })[tag];

   succ(EQ); // GT
   succ(GT); // null

 */


// Ordering -> Ordering
const succ = ({tag}) => ({
  LT: EQ,
  EQ: GT,
  GT: null
})[tag];


// API


module.exports = succ;