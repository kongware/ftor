"use strict";


/**
 * @name try pattern
 * @note applicator specific to pattern matching; local try/catch
 * @type higher order function
 * @status experimental
 * @example

   @see ./match

 */


// (a -> b) -> a -> b
const tryPattern = f => x => {
  try {
    return f(x);
  } catch (_) {
    return null;
  }
};


// (a -> b -> c) -> a -> b -> c
const tryPattern2 = f => x => y => {
  try {
    return f(x) (y);
  } catch (_) {
    return null;
  }
};


// (a -> b -> c -> d) -> a -> b -> c -> d
const tryPattern3 = f => x => y => z => {
  try {
    return f(x) (y) (z);
  } catch (_) {
    return null;
  }
};


// API


module.exports = {tryPattern, tryPattern2, tryPattern3};