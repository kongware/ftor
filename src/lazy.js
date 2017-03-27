"use strict";


/**
 * @name lazy evaluation
 * @type higher order function
 * @example
 *

  const repeat = x => [x, repeat(x)];
  lazy(repeat) (2) (); // [2, function]

 */


// (a -> b) -> a -> () -> b
const lazy = f => x => () => f(x);


// (a -> b -> c) -> a -> b -> () -> c
const lazy2 = f => x => y => () => f(x) (y);


// ((a -> b -> c), a) -> b -> () -> c
const lazy2_ = (f, x) => y => () => f(x) (y);


// (((a, b) -> c), a) -> b -> () -> c
const lazy2__ = (f, x) => y => () => f(x, y);


// (a -> b -> c -> d) -> a -> b -> c -> () -> d
const lazy3 = f => x => y => z => () => f(x) (y) (z);


// ((a -> b -> c -> d), a, b) -> c -> () -> d
const lazy3_ = (f, x, y) => z => () => f(x) (y) (z);


// (((a, b, c) -> d), a, b) -> c -> () -> d
const lazy3__ = (f, x, y) => z => () => f(x, y, z);


// API


module.exports = {lazy, lazy, lazy2, lazy2_, lazy2__, lazy3, lazy3_, lazy3__};