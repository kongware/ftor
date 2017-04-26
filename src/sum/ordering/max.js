"use strict";


// dependencies


const {K} = require("../../K");
const ternarySum = require("./ternarySum");


/**
 * @name maximum
 * @type first order function
 * @example

   max(LT) (GT); // GT
   max(EQ) (LT); // EQ

 */


// Ordering -> Ordering -> Ordering
const max = t2 => t1 => ternarySum(K(t2), K(t1), K(t1)) (t1) (t2);


// API


module.exports = max;