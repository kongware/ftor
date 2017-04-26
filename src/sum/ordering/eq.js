"use strict";


// dependencies


const False = require("../../False");
const True = require("../../True");
const ternarySum = require("./ternarySum");


/**
 * @name equal
 * @type first order function
 * @example

   eq(LT) (LT); // true
   eq(EQ) (LT); // false

 */


// Ordering -> Ordering -> Boolean
const eq = ternarySum(False, False, True);


// API


module.exports = eq;