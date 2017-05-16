"use strict";


/**
 * @name chain
 * @note monadic
 * @type higher order function
 * @status stable
 * @example

  ?

 */


// (a -> r -> b) -> (r -> a) -> r -> b
const chain = f => g => x => f(g(x)) (x);


// (r -> a) -> (a -> r -> b) -> r -> b
const chain_ = g => f => x => f(g(x)) (x);


// API


module.exports = {chain, chain_};