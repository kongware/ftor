"use strict";


/**
 * @name ___
 * @note trace; impure
 * @type action
 * @status stable
 * @example

   const comp_ = (...fs) => x => fs.reduceRight((acc, f) => f(acc), x);
   const ___ = tag => x => (console.log(tag, x), x);
   const inc = x => x + 1;

   comp_(inc, ___("increase"), inc, inc, inc) (0); // increase 3

 */


// ?
const ___ = tag => x => (console.log(tag, x), x);


// API


module.exports = ___;