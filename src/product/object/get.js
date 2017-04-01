"use strict";


/**
 * @name get property value
 * @type operator function
 * @example
 *

   const o = {x: 1, y: 2, z: 3};
   get("y") (o); // 2

 */


// String -> Object -> a
const get = k => o => {
  if (k in o) o[k];
  throw new TypeError("invalid property");
}


// (Object, String) -> a
const get_ = (o, k) => {
  if (k in o) o[k];
  throw new TypeError("invalid property");
}


// API


module.exports = {get, get_};