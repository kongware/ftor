"use strict";


// dependencies


const LT = require("./LT");
const EQ = require("./EQ");
const GT = require("./GT");


/**
 * @name compare
 * @type first order function
 * @status stable
 * @example

  ???

 */


// Ord a => (a -> a -> Boolean) -> a -> a -> Number
const compareBy = pred => x => y => pred(x) (y) ? LT : pred(y) (x) ? GT : EQ;


// Ord a => (a -> a -> Boolean) -> a -> a -> Number
const compareBy_ = pred => y => x => pred(x) (y) ? LT : pred(y) (x) ? GT : EQ;


// API


module.exports = {compareBy, compareBy_};