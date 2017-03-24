"use strict";


// dependencies


const False = require("./False");
const True = require("./True");
const {ternarySum, ternarySum_} = require("./ternarySum");


/**
 * @name lower than or equal
 * @type operator function
 * @example

   lte(EQ) (GT); // true
   lte(GT) (LT); // false
   lte(LT) (LT); // true

 */


// Ordering -> Ordering -> Boolean
const lte = ternarySum(True, False, True);


// (Ordering, Ordering) -> Boolean
const lte_ = ternarySum_(True, False, True);


// API


module.exports = {lte, lte_};