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
const get = k => o => o[k];


// (Object, String) -> a
const get_ = (o, k) => o[k];


// API


module.exports = {get, get_};