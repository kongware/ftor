"use strict";


// dependencies


const I = require("../../I");


/**
 * @name get element
 * @type operator function
 * @example

   Triple(1, 2, 3) (get3); // 3

 */


// (a, _) => a
const get1 = I;


// (_, a) => a
const get2 = (_, x) => x;


// (_, _, a) -> a
const get3 = (_, _, z) => z;


// (_, _, _, a) -> a
const get4 = (_, _, _, z) => z;


// (_, _, _, _, a) -> a
const get5 = (_, _, _, _, z) => z;


// API


module.exports = {get1, get2, get3, get4, get5};