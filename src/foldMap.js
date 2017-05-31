"use strict";


// dependencies


const {B_} = require("./B");


/**
 * @name fold map (by)
 * @note generic concat map; "by" is omitted
 * @type higher order function
 * @status stable
 * @example

  const B_ = (...fs) => x => fs.reduceRight((acc, f) => f(acc), x);
  const foldMap = (fold, concat, empty) => f => fold(B_(concat, f)) (empty);

  const fold = f => acc => xs => xs.reduce((acc, x) => f(acc) (x), acc);
  const concat = xs => ys => xs.concat(ys);
  const empty = [];
  const I = x => x;

  const xs = [[1, 2], [3, 4], [5, 6]]

  foldMap(fold, concat, empty) (I) (xs); // [1, 2, 3, 4, 5, 6]

 */


// (Foldable t, Monoid m) => (a -> m) -> t a -> m
const foldMap = (fold, concat, empty) => f => fold(B_(concat, f)) (empty);


// API


module.exports = foldMap;