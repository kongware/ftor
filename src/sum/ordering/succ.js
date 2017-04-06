"use strict";


// dependencies


const EQ = require("./EQ");
const GT = require("./GT");
const LT = require("./LT");
const raise = require("../../raise");


/**
 * @name successor
 * @type operator function
 * @example

   succ(EQ); // GT
   succ(GT); // TypeError

 */


// Ordering -> Ordering
const succ = ({tag}) => ({
  LT: EQ,
  EQ: GT,
  GT: raise(TypeError) ("invalid succ invocation with GT")
})[tag];


// API


module.exports = succ;