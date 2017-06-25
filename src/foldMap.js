"use strict";


// dependencies


const {comp_} = require("./comp");


/**
 * @name fold map
 * @type higher order function
 * @status stable
 * @example

  const comp_ = (...fs) => x => fs.reduceRight((acc, f) => f(acc), x);
  const foldMap = (foldl, append, empty) => f => foldl(comp_(append, f)) (empty);

  const fold = f => acc => xs => xs.reduce((acc, x) => f(acc) (x), acc);
  const append = xs => ys => xs.concat(ys);
  const empty = [];
  const I = x => x;

  const xs = [[1, 2], [3, 4], [5, 6]]

  foldMap(fold, append, empty) (I) (xs); // [1, 2, 3, 4, 5, 6]

 */


// (Foldable t, Monoid m) => (a -> m) -> t a -> m
const foldMap = (foldl, append, empty) => f => foldl(comp_(append, f)) (empty);


// API


module.exports = foldMap;