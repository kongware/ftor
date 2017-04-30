"use strict";


// dependencies


const LT = require("./LT");
const EQ = require("./EQ");
const GT = require("./GT");


/**
 * @name to enumeration
 * @type first order function
 * @status stable
 * @example

   const Ordering = {};
   const LT = ({type: Ordering, tag: "LT"});
   const EQ = ({type: Ordering, tag: "EQ"});
   const GT = ({type: Ordering, tag: "GT"});

   const toEnum = n => [LT, EQ, GT][n];

   toEnum(0); // LT
   toEnum(1); // EQ
   toEnum(2); // GT

 */


// Number -> Ordering
const toEnum = n => [LT, EQ, GT][n];


// API


module.exports = toEnum;