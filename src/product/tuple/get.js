"use strict";


// dependencies


const I = require("../../I");


/**
 * @name get nth element
 * @type operator function
 * @example

   const Triple = (x, y, z) => f => f(x, y, z);
   const get2 = (_, x) => x;

   Triple(1, "a", true) (get2); // "a"

 */


// (a, _) -> a
const get1 = I;


// (_, a) -> a
const get2 = (_, x) => x;


// (_, _, a) -> a
const get3 = (_, _, z) => z;


// (_, _, _, a) -> a
const get4 = (_, _, _, z) => z;


// (_, _, _, _, a) -> a
const get5 = (_, _, _, _, z) => z;


// API


module.exports = {get1, get2, get3, get4, get5};