"use strict";


/**
 * @name greater then
 * @type operator function
 * @example

   ?

 */


// a -> a -> Boolean
const gt = y => x => x > y;


// a -> a -> Boolean
const gt_ = x => y => x > y;


// API


module.exports = {gt, gt_};