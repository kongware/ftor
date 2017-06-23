"use strict";


/**
 * @name composition in the third argument
 * @type higher order function
 * @status stable
 * @example

  ???

 */


// (a -> b -> d -> e) -> (c -> d) -> a -> b -> c -> e
const comp3rd = f => g => x => y => z => f(x) (y) (g(z));


// (a -> b -> d -> e, c -> d) -> a -> b -> c -> e
const comp3rd_ = (f, g) => x => y => z => f(x) (y) (g(z));


// API


module.exports = {comp3rd, comp3rd_};