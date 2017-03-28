"use strict";


// dependencies


const K = require("../../K");


/**
 * @name second
 * @type operator function
 * @example
 *

   const pair = Pair(1, 2);
   pair(_2nd); // 2

 */


// (a, b) -> ((_, b) => b) -> b
const _2nd = K;


// API


module.exports = _2nd;