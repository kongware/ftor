"use strict";


// dependencies


const I = require("../../I");


/**
 * @name get first item
 * @type operator function
 * @example
 *

   const tuple4 = Tuple4(1, 2, 3, 4);
   triplet(get3); // 3

 */


// (a, b) -> ((a, _) => a) -> a
const get1 = I;


// (a, b) -> ((_, b) => b) -> b
const get2 = (_, y) => y;


// (a, b, c) -> ((_, _, c) => c) -> c
const get3 = (_, _, z) => z;


// (a, b, c, d) -> ((_, _, _, d) => d) -> d
const get4 = (_, _, _, z) => z;


// (a, b, c, d, e) -> ((_, _, _, _, e) => e) -> e
const get5 = (_, _, _, _, z) => z;


// API


module.exports = {get1, get2, get3, get4, get5};