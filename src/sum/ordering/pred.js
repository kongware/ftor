"use strict";


// dependencies


const EQ = require("./EQ");
const GT = require("./GT");
const LT = require("./LT");
const raise = require("../../raise");


/**
 * @name predecessor
 * @type first order function
 * @example

   pred(EQ); // LT
   pred(LT); // TypeError

 */


// Ordering -> Ordering
const pred = ({tag}) => ({
  LT: raise(TypeError) ("invalid pred invocation with LT"),
  EQ: LT,
  GT: EQ
})[tag];


// API


module.exports = pred;