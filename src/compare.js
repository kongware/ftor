"use strict";


// dependencies


const LT = require("./sum/ordering/LT");
const EQ = require("./sum/ordering/EQ");
const GT = require("./sum/ordering/GT");


/**
 * @name compare
 * @type first order function
 * @example

   ?

 */


// Ord a => a -> a -> Ordering
const compare = x => y => x < y ? LT : y < x ? GT : EQ;


// Ord a => a -> a -> Ordering
const compare_ = y => x => x < y ? LT : y < x ? GT : EQ;


// API


module.exports = {compare, compare_};