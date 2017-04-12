"use strict";


/**
 * @name partial application
 * @type variadic higher order function
 * @example

   ?

 */


// ((*) -> a) -> (*) -> (*) -> a
const partial = f => (...args) => (...args2) => f(...args, ...args2);


// ((*) -> a, (*)) -> (*) -> a
const partial_ = (f, ...args) => (...args2) => f(...args, ...args2);


// API


module.exports = {partial, partial_};