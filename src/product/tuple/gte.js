"use strict";


// dependencies


const {compare2, compare3, compare4, compare5} = require("./compare");


/**
 * @name greater than or equal
 * @type operator function
 * @example

   const pair1 = Pair(2, "b");
   const pair2 = Pair(2, "a");
   const pair3 = Pair(2, "b");

   const Num = { compare: y => x => x < y ? LT : y < x ? GT : EQ }
   const Str = { compare: y => x => x < y ? LT : y < x ? GT : EQ }

   gte2(Num, Str) (pair2) (pair1); // true
   gte2(Num, Str) (pair3) (pair1); // true

 */


// Ord a => Object -> (a -> b) -> (a -> b) -> Boolean
const gte = Rep => t2 => t1 => t1(x => t2(y => Rep.gte(y) (x)));


// (Ord a, Ord b) => (Object, Object) -> ((a, b) -> c) -> ((a, b) -> c) -> Boolean
const gte2 = (Rep1, Rep2) => t2 => t1 => {
  switch (compare2(Rep1, Rep2) (t2) (t1).tag) {
    case "EQ":
    case "GT": return true;
    default: return false;
  }
};


// (Ord a, Ord b, Ord c) => (Object, Object, Object) -> ((a, b, c) -> d) -> ((a, b, c) -> d) -> Boolean
const gte3 = (Rep1, Rep2, Rep3) => t2 => t1 => {
  switch (compare3(Rep1, Rep2, Rep3) (t2) (t1).tag) {
    case "EQ":
    case "GT": return true;
    default: return false;
  }
};


// (Ord a, Ord b, Ord c, Ord d) => (Object, Object, Object, Object) -> ((a, b, c, d) -> e) -> ((a, b, c, d) -> e) -> Boolean
const gte4 = (Rep1, Rep2, Rep3, Rep4) => t2 => t1 => {
  switch (compare4(Rep1, Rep2, Rep3, Rep4) (t2) (t1).tag) {
    case "EQ":
    case "GT": return true;
    default: return false;
  }
};


// (Ord a, Ord b, Ord c, Ord d, Ord e) => (Object, Object, Object, Object, Object) -> ((a, b, c, d, e) -> f) -> ((a, b, c, d, e) -> f) -> Boolean
const gte5 = (Rep1, Rep2, Rep3, Rep4, Rep5) => t2 => t1 => {
  switch (compare5(Rep1, Rep2, Rep3, Rep4, Rep5) (t2) (t1).tag) {
    case "EQ":
    case "GT": return true;
    default: return false;
  }
};


// API


module.exports = {gte, gte2, gte3, gte4, gte5};