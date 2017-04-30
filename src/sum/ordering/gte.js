"use strict";


// dependencies


const fromEnum = require("./fromEnum");


/**
 * @name greater than or equal
 * @type first order function
 * @status stable
 * @example

   @see lte

 */


// Ordering -> Ordering -> Boolean
const gte = t1 => t2 => fromEnum(t1) >= fromEnum(t2);


// Ordering -> Ordering -> Boolean
const gte_ = t2 => t1 => fromEnum(t1) >= fromEnum(t2);


// API


module.exports = {gte, gte_};