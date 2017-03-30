"use strict";


/**
 * @name bluebird combinator (function Bosition)
 * @type higher order function
 * @example
 *

   B(x => x * x) (x => x + 1) (4); // 25

 */


// (b -> c) -> (a -> b) -> a -> c
const B = f => g => x => f(g(x));


// ((b -> c), (a -> b)) -> a -> c
const B_ = (f, g) => x => f(g(x));


// (c -> d) -> (a -> b -> c) -> a -> d
const B2 = f => g => x => y => f(g(x) (y));


// ((c -> d), (a -> b -> c)) -> a -> d
const B2_ = (f, g, x) => y => f(g(x) (y));


// ((c -> d), ((a, b) -> c)) -> a -> d
const B2__ = (f, g, x) => y => f(g(x, y));


// (d -> e) -> (a -> b -> c -> d) -> a -> e
const B3 = f => g => x => y => z => f(g(x) (y) (z));


// ((d -> e), (a -> b -> c -> d)) -> a -> e
const B3_ = (f, g, x, y) => z => f(g(x) (y) (z));


// ((d -> e), ((a, b, c) -> d)) -> a -> e
const B3__ = (f, g, x, y) => z => f(g(x, y, z));


// API


module.exports = {B, B_, B2, B2_, B2__, B3, B3_, B3__};