"use strict";


// dependencies


const I = require("../../I");


/**
 * @name get nth element
 * @type operator function
 * @example

   const Triple = (x, y, z) => f => f(x, y, z);
   const getn = n => (...args) => args[n - 1];

   Triple(1, "a", true) (getn(2)); // "a"

 */


// Number -> (*) -> a
const getn = n => (...args) => args[n - 1];


// API


module.exports = getn;