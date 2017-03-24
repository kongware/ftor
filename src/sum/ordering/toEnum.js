"use strict";


// dependencies


const EQ = require("./EQ");
const GT = require("./GT");
const LT = require("./LT");


/**
 * @name to enumeration
 * @type operator function
 * @example

   toEnum(0); // LT
   toEnum(1); // EQ
   toEnum(2); // GT

 */


// Number -> Ordering
const toEnum = n => [LT, EQ, GT][n];


// API


module.exports = toEnum;