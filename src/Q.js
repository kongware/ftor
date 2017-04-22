"use strict";


/**
 * @name reverse composition
 * @note variadic
 * @type higher order function
 * @example

   ?

 */


// (Function) -> (a -> b) -> a -> c
const Q = (...gs) => f => x => f(gs.reduce((acc, g) => g(acc), x));


// (Function) -> a -> b
const Q_ = (...fs) => x => fs.reduce((acc, f) => f(acc), x);


// (Function) -> (a -> b -> c) -> a -> b -> d
const Q2 = (...gs) => f => x => y => f(gs.slice(1).reduce((acc, g) => g(acc), gs[0](x) (y)));


// (Function) -> a -> b -> c
const Q2_ = (...fs) => x => y => fs.slice(1).reduce((acc, f) => f(acc), fs[0](x) (y));


// (Function) -> (a -> b -> c -> d) -> a -> b -> c -> e
const Q3 = (...gs) => f => x => y => z => f(gs.slice(1).reduce((acc, g) => g(acc), gs[0](x) (y) (z)));


// (Function) -> a -> b -> c -> e
const Q3_ = (...fs) => x => y => z => fs.slice(1).reduce((acc, f) => f(acc), fs[0](x) (y) (z));


// API


module.exports = {Q, Q_, Q2, Q2_, Q3, Q3_};