"use strict";


/**
 * @name maximal
 * @type first order function
 * @status stable
 * @example

  const max = x => y => x > y ? x : y;

  max(true) (false); // true
  max(1) (2); // 2
  max("a") ("z"); // z

 */


// a -> a -> a
const max = x => y => x > y ? x : y;


// API


module.exports = max;