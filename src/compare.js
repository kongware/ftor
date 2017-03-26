"use strict";


// dependencies


const LT = require("./sum/ordering/LT");
const EQ = require("./sum/ordering/EQ");
const GT = require("./sum/ordering/GT");


/**
 * @name compare
 * @type operator function
 * @example
 *

   compare(2) (3); // LT
   compare(3) (3); // EQ
   compare(4) (3); // GT

 */


// Ord a => a -> a -> Ordering
const compare = y => x => x < y ? LT : y < x ? GT : EQ;


// Ord a => (a, a) -> Ordering
const compare_ = (x, y) => x < y ? LT : y < x ? GT : EQ;


// API


module.exports = {compare, compare_};