"use strict";


// dependencies


const fromEnum = require("./fromEnum");


/**
 * @name greater than
 * @type first order function
 * @status stable
 * @example

   @see gt

 */


// Ordering -> Ordering -> Boolean
const gt = t1 => t2 => fromEnum(t1) > fromEnum(t2);


// Ordering -> Ordering -> Boolean
const gt_ = t2 => t1 => fromEnum(t1) > fromEnum(t2);


// API


module.exports = {gt, gt_};