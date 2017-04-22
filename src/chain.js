"use strict";


/**
 * @name chain
 * @note monadic
 * @type higher order function
 * @example

   ?

 */


// (r -> a) -> (a -> r -> b) -> r -> b
const chain = f => g => x => g(f(x)) (x);


// (a -> r -> b) -> (r -> a) -> r -> b
const chain_ = f => g => x => f(g(x)) (x);


// API


module.exports = {chain, chain_};