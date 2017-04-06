"use strict";


/**
 * @name partial application
 * @type variadic higher order function
 * @example
 *

   const comp = (f, g, x) => f(g(x));
   const add2 = partial(comp) (x => x + 1, x => x + 1);

   add2(3); // 5

 */


// ((*), (*) -> a) -> (*) -> (*) -> a
const partial = f => (...args) => (...args2) => f(...args, ...args2);


// API


module.exports = partial