"use strict";


// dependencies


const {toArray} = require("../product/tuple");


/**
 * @name Map
 * @note combined namespace/constructor
 * @type abstract type
 * @status stable
 * @example

  const Tuple = (...args) => {
    const Tuple = f => f(...args);
    Tuple[Symbol.iterator] = () => args[Symbol.iterator]();
    return Tuple;
  };

  const toArray = tx => tx((...args) => args);
  
  const Map_ = (...pairs) => {
    return new Map(pairs.map(pair => toArray(pair)));
  };

  Map_(Tuple(1, "a"), Tuple(2, "b")); // Map {1: "a", 2: "b"}

 */


const Map_ = (...pairs) => {
  return new Map(pairs.map(pair => toArray(pair)));
};


// API


module.exports = Map_;