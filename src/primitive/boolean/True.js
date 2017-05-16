"use strict";


// dependencies


const {K} = require("../../K");


/**
 * @name True
 * @type first order function
 * @status stable
 * @example

  const K = x => _ => x;
  const True = K(true);
   
  True(false); // true

 */


// () -> Boolean
const True = K(true);


// API


module.exports = True;