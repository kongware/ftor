"use strict";


// dependencies


const fromEnum = require("./fromEnum");


/**
 * @name ternary sum
 * @type internal function
 */


// (() -> a, () -> a, () -> a) -> Ordering -> Ordering -> a
const ternarySum = (f, g, h) => oy => ox => {
  const x = fromEnum(ox),
   y  = fromEnum(oy);

  return x < y
   ? f()
   : x > y
    ? g()
    : h();
};


// (() -> a, () -> a, () -> a) -> (Ordering, Ordering) -> a
const ternarySum_ = (f, g, h) => (ox, oy) => {
  const x = fromEnum(ox),
   y  = fromEnum(oy);

  return x < y
   ? f()
   : x > y
    ? g()
    : h();
};


module.exports = {ternarySum, ternarySum_};