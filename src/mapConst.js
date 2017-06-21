"use strict";


// dependencies


const {B_} = require("./B");
const {K} = require("./K");


/**
 * @name const map
 * @note take the effect but drop the value
 * @type higher order function
 * @status stable
 * @example

  const B_ = (...fs) => x => fs.reduceRight((acc, f) => f(acc), x);
  const K = x => y => x;
  const mapConst = map => B_(map, K);

  const map = f => xs => xs.map(x => f(x));
  const inc = x => x + 1;

  mapConst(map) (7) ([1, 2, 3]); // [7, 7, 7]
  mapConst(map) (7) ([]); // []

 */


// Functor f => a -> f b -> f a
const mapConst = map => B_(map, K);


// API


module.exports = mapConst;