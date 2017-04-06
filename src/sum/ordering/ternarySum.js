"use strict";


// dependencies


const fromEnum = require("./fromEnum");


/**
 * @name ternary sum
 * @type internal function
 */


// (() -> a, () -> a, () -> a) -> Ordering -> Ordering -> a
const ternarySum = (f, g, h) => t2 => t1 => {
  const x = fromEnum(t1),
   y  = fromEnum(t2);

  return x < y ? f()
   : x > y ? g()
   : h();
};


// API


module.exports = ternarySum;