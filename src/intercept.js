"use strict";


/**
 * @name intercept
 * @type impure higher order function
 * @example
 *

   const add = y => x => x + y;
   intercept2("add:") (add) (2) (3); // logs ARGS add: 2 3 RV 5

 */


// ?
const intercept = tag => f => x => (console.log("ARGS", tag, x), x = f(x), console.log("RV", x), x);


// ?
const intercept2 = tag => f => x => y => (console.log("ARGS", tag, x, y), x = f(x) (y), console.log("RV", x), x);


// ?
const intercept3 = tag => f => x => y => z => (console.log("ARGS", tag, x, y, z), x = f(x) (y) (z), console.log("RV", x), x);


// API


module.exports = {intercept, intercept2, intercept3};