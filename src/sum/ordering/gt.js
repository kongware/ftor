"use strict";


// dependencies


const False = require("../../False");
const True = require("../../True");
const ternarySum = require("./ternarySum");


/**
 * @name greater than
 * @type first order function
 * @example

   gt(EQ) (GT); // false
   gt(GT) (LT); // true
   gt(LT) (LT); // false

 */


// Ordering -> Ordering -> Boolean
const gt = ternarySum(False, True, False);


// API


module.exports = gt;