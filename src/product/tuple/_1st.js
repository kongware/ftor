"use strict";


// dependencies


const I = require("../../I");


/**
 * @name first item
 * @type operator function
 * @example
 *

   const pair = Pair(1, 2);
   pair(_1st); // 1

 */


// (a, b) -> ((a, _) => a) -> a
const _1st = I;


// API


module.exports = _1st;