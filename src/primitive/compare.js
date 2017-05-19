"use strict";


// dependencies


const LT = require("./LT");
const EQ = require("./EQ");
const GT = require("./GT");


/**
 * @name compare
 * @type first order function
 * @status stable
 * @example

  const compare = x => y => x < y ? LT : y < x ? GT : EQ;
  const compare_ = y => x => x < y ? LT : y < x ? GT : EQ;
  const uncurry = f => (x, y) => f(x) (y);
  const LT = -1;
  const EQ = 0;
  const GT = 1;

  [4, 1, 5, 3, 2].sort(uncurry(compare)); // [1, 2, 3, 4, 5]
  [4, 1, 5, 3, 2].sort(uncurry(compare_)); // [1, 2, 3, 4, 5]
  compare("a") ("z"); // LT
  compare(true) (true); // EQ

 */


// Ord a => a -> a -> Ordering
const compare = x => y => x < y ? LT : y < x ? GT : EQ;


// Ord a => a -> a -> Ordering
const compare_ = y => x => x < y ? LT : y < x ? GT : EQ;


// API


module.exports = {compare, compare_};