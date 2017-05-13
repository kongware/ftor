"use strict";


// dependencies


const {K} = require("../../K");


/**
 * @name False
 * @type first order function
 * @status stable
 * @example

   const K = x => _ => x;
   const False = K(false);

   False(true); // false

 */


// () -> Boolean
const False = K(false);


// API


module.exports = False;