"use strict";


// dependencies


const {K} = require("../../K");
const ternarySum = require("./ternarySum");


/**
 * @name minimum
 * @type operator function
 * @example

   min(LT) (GT); // LT
   min(EQ) (GT); // EQ

 */


// Ordering -> Ordering -> Ordering
const min = t2 => t1 => ternarySum(K(t1), K(t2), K(t1)) (t1) (t2);


// API


module.exports = min;