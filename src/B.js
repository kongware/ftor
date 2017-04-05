"use strict";


// dependencies


const init = require("./product/array/init");
const last = require("./product/array/last");


/**
 * @name bluebird combinator (function Bosition)
 * @type higher order function
 * @example
 *

   const inc = x => x + 1;
   const sqr = x => x * x;
   
   B_(sqr, inc, inc, inc, inc) (1); // 25

 */


// (Function) -> (a -> b) -> a -> ?
const B = (...fs) => g => x => fs.reduce((acc, f) => f(acc), g(x));


// (Function) -> a -> ?
const B_ = (...fs) => x => fs.reduce((acc, f) => f(acc), x);


// (Function) -> (a -> b -> c) -> a -> b -> ?
const B2 = (...fs) => g => x => y => fs.reduce((acc, f) => f(acc), g(x) (y));


// (Function) -> a -> b -> ?
const B2_ = (...fs) => x => B_(...init(fs), last(fs) (x));


// (Function) -> (a, b) -> ?
const B2__ = (...fs) => (x, y) => B_(...init(fs)) (last(fs) (x, y));


// (Function) -> (a -> b -> c -> d) -> a -> b -> c -> ?
const B3 = (...fs) => g => x => y => z => fs.reduce((acc, f) => f(acc), g(x) (y) (z));


// (Function) -> a -> b -> c -> ?
const B3_ = (...fs) => x => y => B_(...init(fs), last(fs) (x) (y));


// (Function) -> (a, b, c) -> ?
const B3__ = (...fs) => (x, y, z) => B_(...init(fs)) (last(fs) (x, y, z));


// API


module.exports = {B, B_, B2, B2_, B2__, B3, B3_, B3__};