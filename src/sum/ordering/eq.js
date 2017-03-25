"use strict";


// dependencies


const False = require("../../False");
const True = require("../../True");
const {ternarySum, ternarySum_} = require("./ternarySum");


/**
 * @name equal
 * @type operator function
 * @example

   eq(LT) (LT); // true
   eq(EQ) (LT); // false

 */


// Ordering -> Ordering -> Boolean
const eq = ternarySum(False, False, True);


// (Ordering, Ordering) -> Boolean
const eq_ = ternarySum_(False, False, True);


// API


module.exports = {eq, eq_};