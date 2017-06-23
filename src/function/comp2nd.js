"use strict";


/**
 * @name composition in the second argument
 * @type higher order function
 * @status stable
 * @example

  ???

 */


// (a -> c -> d) -> (b -> c) -> a -> b -> d
const comp2nd = f => g => x => y => f(x) (g(y));


// (a -> c -> d, b -> c) -> a -> b -> d
const comp2nd_ = (f, g) => x => y => f(x) (g(y));


// API


module.exports = {comp2nd, comp2nd_};