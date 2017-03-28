"use strict";


/**
 * @name curry binary operator function
 * @type higher order function
 * @example
 *

   const sub2 = curryOp((x, y) => x - y) (2);
   sub2(3); // 1

 */


// ((a, b) -> c) -> b -> a -> c
const curryOp = f => y => x => f(x, y);


// API


module.exports = curryOp;