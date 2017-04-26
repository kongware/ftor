"use strict";


/**
 * @name get property value
 * @type first order function
 * @example
 *

   const o = {x: 1, y: 2, z: 3};
   get("y") (o); // 2

 */


// String -> Object -> a
const get = k => o => {
  if (k in o) return o[k];
  throw new TypeError("invalid property");
};


// API


module.exports = get;