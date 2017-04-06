"use strict";


// dependencies


const False = require("../../False");
const True = require("../../True");
const ternarySum = require("./ternarySum");


/**
 * @name not equal
 * @type operator function
 * @example

   neq(LT) (LT); // false
   neq(EQ) (LT); // true

 */


// Ordering -> Ordering -> Boolean
const neq = ternarySum(True, True, False);


// API


module.exports = neq;