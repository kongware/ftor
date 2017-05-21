"use strict";


/**
 * @name partial
 * @note partial application
 * @type higher order function
 * @status stable
 * @example

  const partial = f => (...args) => (...args2) => f(...args, ...args2);
  const sum = partial((x, y, z) => x + y + z);

  sum(1, 2) (3); // 6
  sum(1) (2, 3); // 6

 */


// ((*) -> a) -> (*) -> (*) -> a
const partial = f => (...args) => (...args2) => f(...args, ...args2);


// ((*) -> a, (*)) -> (*) -> a
const partial_ = (f, ...args) => (...args2) => f(...args, ...args2);


// API


module.exports = {partial, partial_};