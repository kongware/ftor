"use strict";


// dependencies


const {K, K_} = require("./K");
const {lifta2} = require("./lifta");


/**
 * @name const apply
 * @note take both effects but drop the values of the first/second action
 * @type higher order function
 * @status stable
 * @example

  const lifta2 = (map, ap) => f => tx => ty => ap(map(f) (tx)) (ty);
  const K_ = x => y => y;

  const constAp = (map, ap) => lifta2(map, ap) (K_);

  const map = f => xs => xs.map(x => f(x));
  const ap = fs => xs => fs.reduce((acc, f) => acc.concat(xs.map(x => f(x))), []);

  constAp(map, ap) ([1, 2]) ([3, 4]); // [3, 4, 3, 4]
  constAp(map, ap) ([]) ([3, 4]); // []

 */


// Applicative f => f a -> f b -> f b
const constAp = (map, ap) => lifta2(map, ap) (K_);


// Applicative f => f a -> f b -> f a
const constAp_ = (map, ap) => lifta2(map, ap) (K);


// API


module.exports = {constAp, constAp_};