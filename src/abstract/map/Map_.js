"use strict";


// dependencies


const {set_} = require("./set");


/**
 * @name map
 * @note without new; expects pairs
 * @type data constructor
 * @example

   ?

 */


// [((*, *) -> *)] -> Map
const Map_ = pairs => {
  const map = Reflect.construct(Map, []);
  pairs.forEach(pair => set_(pair) (map));
  return map;
};


// API


module.exports = Map_;