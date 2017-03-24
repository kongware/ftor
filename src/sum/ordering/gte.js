"use strict";


// dependencies


const False = require("./False");
const True = require("./True");
const {ternarySum, ternarySum_} = require("./ternarySum");


/**
 * @name greater than or equal
 * @type operator function
 * @example

   gte(EQ) (GT); // false
   gte(GT) (LT); // true
   gte(LT) (LT); // true

 */


// Ordering -> Ordering -> Boolean
const gte = ternarySum(False, True, True);


// (Ordering, Ordering) -> Boolean
const gte = ternarySum(False, True, True);


// API


module.exports = {gte, gte_};