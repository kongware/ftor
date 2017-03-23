"use strict";


// dependencies


const {concat, concat_} = require("./concat");


/**
 * @name append
 * @type function
 * @example

   append(LT) (GT); // LT
   append(EQ) (GT); // GT
   append(EQ) (EQ); // EQ

 */


// Ordering -> Ordering -> Ordering
const append = concat;


// (Ordering, Ordering) -> Ordering
const append_ = concat_;


// API


module.exports = {concat, concat_};