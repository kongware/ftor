"use strict";


// dependencies


const {set_} = require("./set");


/**
 * @name weakMap
 * @note without new; expects pairs
 * @type data constructor
 * @example

   ?

 */


// [((*, *) -> *)] -> WeakMap
const WeakMap_ = pairs => {
  const weakMap = Reflect.construct(WeakMap, []);
  pairs.forEach(pair => set_(pair) (weakMap));
  return weakMap;
};


// API


module.exports = WeakMap_;