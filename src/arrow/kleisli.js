"use strict";


/**
 * @name kleisli
 * @note Kleisli composition
 * @type higher order function
 * @status unstable
 * @example

  const kleisli = chain => ft => gt => x => chain(gt(x)) (ft);

  const chain = tx => ft => tx.map(x => join(ft(x)));
  const join = ttx => ttx[0];
  const of = x => [x];

  const sqrk = x => [x * x];
  const dblk = x => [x * 2];

  kleisli(chain) (dblk) (sqrk) (3); // [18]

 */


// Monad m => (b -> m c) -> (a -> m b) -> a -> m c
const kleisli = chain => ft => gt => x => chain(gt(x)) (ft);


// Monad m => (a -> m c) -> (b -> m b) -> a -> m c
const kleisli_ = chain => gt => ft => x => chain(gt(x)) (ft);


// API


module.exports = {kleisli, kleisli_};