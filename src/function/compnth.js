"use strict";


/**
 * @name composition in the nth arguemnt
 * @type higher order function
 * @status stable
 * @example

  ???

 */


// (a -> c -> d) -> (b -> c) -> a -> b -> d
const comp2nd = f => g => x => y => f(x) (g(y));


// (a -> c -> d, b -> c) -> a -> b -> d
const comp2nd_ = (f, g) => x => y => f(x) (g(y));


// (a -> b -> d -> e) -> (c -> d) -> a -> b -> c -> e
const comp3rd = f => g => x => y => z => f(x) (y) (g(z));


// (a -> b -> d -> e, c -> d) -> a -> b -> c -> e
const comp3rd_ = (f, g) => x => y => z => f(x) (y) (g(z));


// API


module.exports = {comp2nd, comp2nd_, comp3rd, comp3rd_};