"use strict";


// dependencies


const {compare2, compare3, compare4, compare5} = require("./compare");
const Single = require("./Single");


/**
 * @name maximal
 * @type higher order function
 * @class Ord
 * @example

   @see min

 */


// Ord a => Object -> (a -> b) -> (a -> b) -> (a -> b)
const max = Rep => t2 => t1 => t1(x => t2(y => Single(Rep.max(y) (x))));


// (Ord a, Ord b) => (Object, Object) -> ((a, b) -> c) -> ((a, b) -> c) -> ((a, b) -> c)
const max2 = (Rep1, Rep2) => t2 => t1 => {
  switch (compare2(Rep1, Rep2) (t2) (t1).tag) {
    case "LT": return t2;
    default: return t1;
  }
};


// (Ord a, Ord b, Ord c) => (Object, Object, Object) -> ((a, b, c) -> d) -> ((a, b, c) -> d) -> ((a, b, c) -> d)
const max3 = (Rep1, Rep2, Rep3) => t2 => t1 => {
  switch (compare3(Rep1, Rep2, Rep3) (t2) (t1).tag) {
    case "LT": return t2;
    default: return t1;
  }
};


// (Ord a, Ord b, Ord c, Ord d) => (Object, Object, Object, Object) -> ((a, b, c, d) -> e) -> ((a, b, c, d) -> e) -> ((a, b, c, d) -> e)
const max4 = (Rep1, Rep2, Rep3, Rep4) => t2 => t1 => {
  switch (compare4(Rep1, Rep2, Rep3, Rep4) (t2) (t1).tag) {
    case "LT": return t2;
    default: return t1;
  }
};


// (Ord a, Ord b, Ord c, Ord d, Ord e) => (Object, Object, Object, Object, Object) -> ((a, b, c, d, e) -> f) -> ((a, b, c, d, e) -> f) -> ((a, b, c, d, e) -> f)
const max5 = (Rep1, Rep2, Rep3, Rep4, Rep5) => t2 => t1 => {
  switch (compare5(Rep1, Rep2, Rep3, Rep4, Rep5) (t2) (t1).tag) {
    case "LT": return t2;
    default: return t1;
  }
};


// API


module.exports = {max, max2, max3, max4, max5};