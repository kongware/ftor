"use strict";


// dependencies


const K = require("../../K");
const {ternarySum_} = require("./ternarySum");


/**
 * @name maximum
 * @type operator function
 * @example

   max(LT) (GT); // GT
   max(EQ) (LT); // EQ

 */


// Ordering -> Ordering -> Ordering
const max = t2 => t1 => ternarySum_(K(t2), K(t1), K(t1)) (t1, t2);


// (Ordering, Ordering) -> Ordering
const max_ = (t1, t2) => ternarySum_(K(t2), K(t1), K(t1)) (t1, t2);


// API


module.exports = {max, max_};