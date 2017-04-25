"use strict";


/**
 * @name curry operator function
 * @type higher order function
 * @example

   ?

 */


// ((a, b) -> c) -> b -> a -> c
const curryOp = f => y => x => f(x, y);


// ((a, b, c) -> d) -> c -> a -> b -> d
const curryOp3 = f => z => x => y => f(x, y, z);


// API


module.exports = {curryOp, curryOp3};