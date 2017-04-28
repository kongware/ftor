"use strict";


/**
 * @name greater than
 * @note works with all types through explicit type cast
 * @type first order function
 * @status unstable
 * @example

   ?

 */


// a -> a -> Boolean
const gt = x => y => !!x > !!y;


// a -> a -> Boolean
const gt_ = y => x => !!x > !!y;


// API


module.exports = {gt, gt_};