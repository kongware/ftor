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
const min = oy => ox => ternarySum_(K(ox), K(oy), K(ox)) (ox, oy);


// (Ordering, Ordering) -> Ordering
const min_ = (ox, oy) => ternarySum_(K(ox), K(oy), K(ox)) (ox, oy);


module.exports = {min, min_};