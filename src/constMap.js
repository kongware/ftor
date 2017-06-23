"use strict";


// dependencies


const {comp_} = require("./comp");
const {K} = require("./K");


/**
 * @name constant map
 * @note take the effect but drop the value
 * @type higher order function
 * @status stable
 * @example

  const comp_ = (...fs) => x => fs.reduceRight((acc, f) => f(acc), x);
  const K = x => y => x;
  const constMap = map => comp_(map, K);

  const map = f => xs => xs.map(x => f(x));
  const inc = x => x + 1;

  constMap(map) (7) ([1, 2, 3]); // [7, 7, 7]
  constMap(map) (7) ([]); // []

 */


// Functor f => a -> f b -> f a
const constMap = map => comp_(map, K);


// API


module.exports = constMap;