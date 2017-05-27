"use strict";


/**
 * @name monadic lift
 * @type higher order function
 * @status stable
 * @example

  ???

 */


// Monad m => (a -> b -> c) -> m a -> m b -> m c
const liftm2 = (of, chain) => f => tx => ty => chain(x => chain(y => of(f(x) (y))) (ty)) (tx);


// Monad m => (a -> b -> c -> d) -> m a -> m b -> m c -> m d
const liftm3 = (of, chain) => f => tx => ty => tz => chain(x => chain(y => chain(z => of(f(x) (y))) (tz)) (ty)) (tx);


// API


module.exports = {liftm2, liftm3};