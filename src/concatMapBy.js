"use strict";


// dependencies


const {B_} = require("./B");
const {concat} = require("./product/array");


/**
 * @name concat map by
 * @type higher order function
 * @status stable
 * @example

  const concat = xs => y => xs.concat(y);
  const B_ = (...fs) => x => fs.reduceRight((acc, f) => f(acc), x);
  const foldl = f => acc => xs => xs.reduce((acc, x, i) => f(acc) (x, i), acc);
  const concatMapBy = foldl => f => foldl(B_(concat, f)) ([]);

  const I = x => x;
  const flatten = concatMapBy(foldl) (I);
  const xs = [[1], [2], [3]];

  flatten(xs); // [1, 2, 3]

 */


// Foldable t => (a -> b -> a) -> (a -> [b]) -> t a -> [b]
const concatMapBy = foldl => f => foldl(B_(concat, f)) ([]);


// API


module.exports = concatMapBy;