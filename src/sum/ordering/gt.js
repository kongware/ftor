"use strict";


// dependencies


const False = require("./False");
const True = require("./True");
const {ternarySum, ternarySum_} = require("./ternarySum");


/**
 * @name greater than
 * @type operator function
 * @example

   gt(EQ) (GT); // false
   gt(GT) (LT); // true
   gt(LT) (LT); // false

 */


// Ordering -> Ordering -> Boolean
const gt = ternarySum(False, True, False);


// (Ordering, Ordering) -> Boolean
const gt_ = ternarySum_(False, True, False);


// API


module.exports = {gt, gt_};