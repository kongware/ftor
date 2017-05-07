"use strict";


/**
 * @name ___
 * @note trace; impure
 * @type first order function
 * @example

   const B_ = (...fs) => x => fs.reduceRight((acc, f) => f(acc), x);
   const ___ = tag => x => (console.log(tag, x), x);
   const inc = x => x + 1;

   B_(inc, ___("increase"), inc, inc, inc) (0); // increase 3

 */


// ?
const ___ = tag => x => (console.log(tag, x), x);


// API


module.exports = ___;