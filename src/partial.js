"use strict";


/**
 * @name partial application
 * @type variadic higher order function
 * @example
 *

   const comp = (f, g, x) => f(g(x));
   const plus2 = partial(comp) (x => x + 1, x => x + 1);

   plus2(3); // 5

 */


// ?
const partial = f => (...args) => (...args2) => f(...args, ...args2);


// ?
const partial_ = (f, ...args) => (...args2) => f(...args, ...args2);


// API


module.exports = {partial, partial_};