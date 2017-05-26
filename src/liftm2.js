"use strict";


/**
 * @name monadic lift 2
 * @type higher order function
 * @status unstable
 * @example

  ???

 */


// Monad m => (a -> a -> b) -> m a -> m a -> m b
const liftm2 = chain => f => tx => ty => chain(x => chain(y => f(x) (y)) (ty)) (tx);


// API


module.exports = liftm2;