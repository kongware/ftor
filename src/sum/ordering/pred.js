"use strict";


// dependencies


const LT = require("./LT");
const EQ = require("./EQ");


/**
 * @name predessor
 * @type first order function
 * @status stable
 * @example

   @see succ

 */


// Ordering -> Ordering
const pred = ({tag}) => ({
  LT: null,
  EQ: LT,
  GT: EQ
})[tag];


// API


module.exports = pred;