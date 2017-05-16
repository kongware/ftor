"use strict";


/**
 * @name identity
 * @type first order function
 * @status stable
 * @example

  const I = x => x;
  I("foo"); // foo

 */


// a -> a
const I = x => x;


// API


module.exports = I;