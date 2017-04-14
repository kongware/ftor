"use strict";


// dependencies


const {compare2, compare3, compare4, compare5} = require("./compare");
const Single = require("./Single");


/**
 * @name minimal
 * @type operator function
 * @example

   const pair1 = Pair(2, "a");
   const pair2 = Pair(2, "b");
   const pair3 = Pair(1, "b");

   const Num = { compare: y => x => x < y ? LT : y < x ? GT : EQ }
   const Str = { compare: y => x => x < y ? LT : y < x ? GT : EQ }

   min2(Num, Str) (pair2) (pair1); // pair1
   min2(Num, Str) (pair3) (pair1); // pair3

 */


// Ord a => Object -> (a -> b) -> (a -> b) -> (a -> b)
const min = Rep => t2 => t1 => t1(x => t2(y => Single(Rep.min(y) (x))));


// (Ord a, Ord b) => (Object, Object) -> ((a, b) -> c) -> ((a, b) -> c) -> ((a, b) -> c)
const min2 = (Rep1, Rep2) => t2 => t1 => {
  switch (compare2(Rep1, Rep2) (t2) (t1).tag) {
    case "GT": return t2;
    default: return t1;
  }
};


// (Ord a, Ord b, Ord c) => (Object, Object, Object) -> ((a, b, c) -> d) -> ((a, b, c) -> d) -> ((a, b, c) -> d)
const min3 = (Rep1, Rep2, Rep3) => t2 => t1 => {
  switch (compare3(Rep1, Rep2, Rep3) (t2) (t1).tag) {
    case "GT": return t2;
    default: return t1;
  }
};


// (Ord a, Ord b, Ord c, Ord d) => (Object, Object, Object, Object) -> ((a, b, c, d) -> e) -> ((a, b, c, d) -> e) -> ((a, b, c, d) -> e)
const min4 = (Rep1, Rep2, Rep3, Rep4) => t2 => t1 => {
  switch (compare4(Rep1, Rep2, Rep3, Rep4) (t2) (t1).tag) {
    case "GT": return t2;
    default: return t1;
  }
};


// (Ord a, Ord b, Ord c, Ord d, Ord e) => (Object, Object, Object, Object, Object) -> ((a, b, c, d, e) -> f) -> ((a, b, c, d, e) -> f) -> ((a, b, c, d, e) -> f)
const min5 = (Rep1, Rep2, Rep3, Rep4, Rep5) => t2 => t1 => {
  switch (compare5(Rep1, Rep2, Rep3, Rep4, Rep5) (t2) (t1).tag) {
    case "GT": return t2;
    default: return t1;
  }
};


// API


module.exports = {min, min2, min3, min4, min5};