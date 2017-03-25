"use strict";


/**
 * @name function composition
 * @type higher order function
 * @example
 *

   comp(x => x * x) (x => x + 1) (4); // 25

 */


// (b -> c) -> (a -> b) -> a -> c
const comp = f => g => x => f(g(x));


// ((b -> c), (a -> b)) -> a -> c
const comp_ = (f, g) => x => f(g(x));


// (c -> d) -> (a -> b -> c) -> a -> d
const comp2 = f => g => x => y => f(g(x) (y));


// ((c -> d), (a -> b -> c)) -> a -> d
const comp2_ = (f, g, x) => y => f(g(x) (y));


// ((c -> d), ((a, b) -> c)) -> a -> d
const comp2__ = (f, g, x) => y => f(g(x, y));


// (d -> e) -> (a -> b -> c -> d) -> a -> e
const comp3 = f => g => x => y => z => f(g(x) (y) (z));


// ((d -> e), (a -> b -> c -> d)) -> a -> e
const comp3_ = (f, g, x, y) => z => f(g(x) (y) (z));


// ((d -> e), ((a, b, c) -> d)) -> a -> e
const comp3__ = (f, g, x, y) => z => f(g(x, y, z));


// API


module.exports = {comp, comp_, comp2, comp2_, comp2__, comp3, comp3_, comp3__};