"use strict";


/**
 * @name curry operator function
 * @type higher order function
 * @example

   const sub = curryOp((x, y) => x - y);
   const sub2 = sub(2);
   sub2(3); // 1

 */


// ((a, b) -> c) -> b -> a -> c
const curryOp = f => y => x => f(x, y);


// ((a, b) -> c) -> b -> a -> c
const curryOp3 = f => z => x => y => f(x, y, z);


// API


module.exports = {curryOp, curryOp3};