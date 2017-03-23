"use strict";


// dependencies


const False = require("./False");
const True = require("./True");
const {ternarySum, ternarySum_} = require("./ternarySum");


/**
 * @name not equal
 * @type function
 * @example

   neq(LT) (LT); // false
   neq(EQ) (LT); // true

 */


// Ordering -> Ordering -> Boolean
const neq = ternarySum(True, True, False);


// (Ordering, Ordering) -> Boolean
const neq_ = ternarySum_(True, True, False);


// API


module.exports = {neq, neq_};