"use strict";


// dependencies


const K = require("../../K");
const {ternarySum_} = require("./ternarySum");


/**
 * @name maximum
 * @type function
 * @example

   max(LT) (GT); // GT
   max(EQ) (LT); // EQ

 */


// Ordering -> Ordering -> Ordering
const max = oy => ox => ternarySum_(K(oy), K(ox), K(ox)) (ox, oy);


// (Ordering, Ordering) -> Ordering
const max_ = (ox, oy) => ternarySum_(K(oy), K(ox), K(ox)) (ox, oy);


// API


module.exports = {max, max_};