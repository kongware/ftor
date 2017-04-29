"use strict";


/**
 * @name equal
 * @note commutative
 * @type first order function
 * @status stable
 * @example

   const Ordering = {};
   const LT = ({type: Ordering, tag: "LT"});
   const EQ = ({type: Ordering, tag: "EQ"});
   const GT = ({type: Ordering, tag: "GT"});

   const eq = ({tag: x}) => ({tag: y}) => x === y;

   eq(LT) (LT); // true
   eq(EQ) (LT); // false

 */


// Ordering -> Ordering -> Boolean
const eq = ({tag: x}) => ({tag: y}) => x === y;


// API


module.exports = eq;