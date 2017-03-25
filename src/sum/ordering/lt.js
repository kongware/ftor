"use strict";


// dependencies


const False = require("../../False");
const True = require("../../True");
const {ternarySum, ternarySum_} = require("./ternarySum");


/**
 * @name lower than
 * @type operator function
 * @example

   lt(EQ) (GT); // true
   lt(GT) (LT); // false
   lt(LT) (LT); // false

 */


// Ordering -> Ordering -> Boolean
const lt = ternarySum(True, False, False);


// (Ordering, Ordering) -> Boolean
const lt_ = ternarySum_(True, False, False);


// API


module.exports = {lt, lt_};