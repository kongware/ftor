"use strict";


// dependencies


const False = require("../../False");
const True = require("../../True");
const ternarySum = require("./ternarySum");


/**
 * @name greater than or equal
 * @type first order function
 * @example

   gte(EQ) (GT); // false
   gte(GT) (LT); // true
   gte(LT) (LT); // true

 */


// Ordering -> Ordering -> Boolean
const gte = ternarySum(False, True, True);


// API


module.exports = gte;