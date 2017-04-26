"use strict";


/**
 * @name greater then
 * @type first order function
 * @example

   ?

 */


// a -> a -> Boolean
const gt = x => y => x > y;


// a -> a -> Boolean
const gt_ = y => x => x > y;


// API


module.exports = {gt, gt_};