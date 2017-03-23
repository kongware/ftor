"use strict";


// dependencies


const EQ = require("./EQ");
const GT = require("./GT");
const K = require("../../K");
const LT = require("./LT");
const {ternarySum, ternarySum_} = require("./ternarySum");


/**
 * @name compare
 * @type function
 * @example

   compare(EQ) (GT); // LT
   compare(GT) (GT); // EQ
   compare(GT) (LT); // GT

 */


// Ordering -> Ordering -> Ordering
const pred = ({tag}) => ({
  LT: raise_(TypeError, "invalid pred invocation with LT"),
  EQ: LT,
  GT: EQ
})[tag];


// API


module.exports = pred;