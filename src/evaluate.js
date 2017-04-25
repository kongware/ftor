"use strict";


/**
 * @name evaluate
 * @type higher order function
 * @example

   ?

 */


// ?
const evaluate = x => typeof x === "function" ? x() : x;


// API


module.exports = evaluate;