"use strict";


// dependencies


const {toArray} = require("../product/tuple");


/**
 * @name Map
 * @note combined namespace/constructor; works with both array and tuple pairs
 * @type abstract type
 * @status stable
 * @example

  const Tuple = (...args) => {
    const Tuple = f => f(...args);
    return Object.freeze(Object.assign(Tuple, args));
  };

  const toArray = tx => tx((...args) => args);
  
  const Map_ = (...pairs) => {
    return new Map(pairs);
  };

  Map_(Tuple(1, "a"), Tuple(2, "b")); // Map {1 => "a", 2 => "b"}

 */


const Map_ = (...pairs) => {
  return new Map(pairs);
};


// API


module.exports = Map_;