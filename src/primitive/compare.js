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

  const compare = x => y => x < y ? -1 : y < x ? 1 : 0;
  const uncurry = f => (x, y) => f(x) (y);
  const LT = -1;
  const EQ = 0;
  const GT = 1;

  [8, 3, 6, 5, 1, 9, 4, 2, 7].sort(uncurry(compare)); // [1, 2, 3, 4, 5, 6, 7, 8, 9]
  compare("a") ("z"); // LT
  compare(true) (true); // EQ

 */


// Ord a => a -> a -> Ordering
const compare = x => y => x < y ? LT : y < x ? GT : EQ;


// Ord a => a -> a -> Ordering
const compare_ = y => x => x < y ? LT : y < x ? GT : EQ;


// API


module.exports = {compare, compare_};