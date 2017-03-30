"use strict";


/**
 * @name last item
 * @type operator function
 * @example
 *

   const tuple5 = Tuple5(1, 2, 3, 4, 5);
   tuple5(last); // 5

 */


// (*) -> a
const last = (...args) => args[args.length - 1];


// API


module.exports = last;