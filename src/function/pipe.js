"use strict";


/**
 * @name pipe
 * @note contra-functorial
 * @type higher order function
 * @status stable
 * @example

  ??

 */


// [(* -> *)] -> (* -> *) -> * -> *
const pipe = (...gs) => f => x => f(gs.reduce((acc, g) => g(acc), x));


// [(* -> *)] -> * -> *
const pipe_ = (...fs) => x => fs.reduce((acc, f) => f(acc), x);


// [(* -> *)] -> (* -> * -> *) -> * -> * -> *
const pipe2 = (...gs) => f => x => y => f(gs.slice(1).reduce((acc, g) => g(acc), gs[0](x) (y)));


// [(* -> *)] -> * -> * -> *
const pipe2_ = (...fs) => x => y => fs.slice(1).reduce((acc, f) => f(acc), fs[0](x) (y));


// [(* -> *)] -> (* -> * -> * -> *) -> * -> * -> * -> *
const pipe3 = (...gs) => f => x => y => z => f(gs.slice(1).reduce((acc, g) => g(acc), gs[0](x) (y) (z)));


// [(* -> *)] -> * -> * -> * -> *
const pipe3_ = (...fs) => x => y => z => fs.slice(1).reduce((acc, f) => f(acc), fs[0](x) (y) (z));


// API


module.exports = {pipe, pipe_, pipe2, pipe2_, pipe3, pipe3_};