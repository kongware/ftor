"use strict";


/**
 * @name bi composition
 * @type higher order function
 * @status stable
 * @example

  ???

 */


// (c -> d -> e) -> (a -> c) -> (b -> d) -> a -> b -> e
const bicomp = f => g => h => x => y => f(g(x)) (h(y));


// (c -> d -> e, a -> c, b -> d) -> a -> b -> e
const bicomp_ = (f, g, h) => x => y => f(g(x)) (h(y));


// API


module.exports = {bicomp, bicomp_};