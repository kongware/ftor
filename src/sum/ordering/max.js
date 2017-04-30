"use strict";


// dependencies


const fromEnum = require("./fromEnum");


/**
 * @name maximum
 * @note commutative
 * @type first order function
 * @status stable
 * @example

   @see min

 */


// Ordering -> Ordering -> Ordering
const max = t1 => t2 => fromEnum(t1) >= fromEnum(t2) ? t1 : t2;


// API


module.exports = max;