"use strict";


// dependencies


const K = require("../../K");
const {ternarySum_} = require("./ternarySum");


/**
 * @name minimum
 * @type function
 * @example

   min(LT) (GT); // LT
   min(EQ) (GT); // EQ

 */


// Ordering -> Ordering -> Ordering
const min = t2 => t1 => ternarySum_(K(t1), K(t2), K(t1)) (t1, t2);


// (Ordering, Ordering) -> Ordering
const min_ = (t1, t2) => ternarySum_(K(t1), K(t2), K(t1)) (t1, t2);


// API


module.exports = {min, min_};