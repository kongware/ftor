"use strict";


/**
 * @name try catch
 * @type higher order function
 * @status experimental
 * @example

  ?

 */


// (a -> c) -> (a -> b -> c) -> c
const try_ = f => g => x => {
  try {
    return f(x);
  } catch (e) {
    return g(x) (e);
  }
};


// (a -> b -> d) -> (a -> b -> c -> d) -> d
const try2 = f => g => x => y => {
  try {
    return f(x) (y);
  } catch (e) {
    return g(x) (y) (e);
  }
};


// (a -> b -> c -> e) -> (a -> b -> c -> d -> e) -> e
const try3 = f => g => x => y => z => {
  try {
    return f(x) (y) (z);
  } catch (e) {
    return g(x) (y) (z) (e);
  }
};


// API


module.exports = {try_, try2, try3};