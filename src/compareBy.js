"use strict";


// dependencies


const LT = require("./sum/ordering/LT");
const EQ = require("./sum/ordering/EQ");
const GT = require("./sum/ordering/GT");


/**
 * @name compare by
 * @type first order function
 * @example

   ?

 */


// Ord a => (a -> a -> Boolean) -> a -> a -> Ordering
const compareBy = f => x => y => f(x) (y) ? LT : f(y) (x) ? GT : EQ;


// API


module.exports = compareBy;