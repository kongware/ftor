"use strict";


/**
 * @name has property
 * @type operator function
 * @example
 *

   const o = {x: 1, y: 2, z: 3};
   has("y") (o); // true

 */


// String -> Object -> Boolean
const has = k => o => k in o;


// (Object, String) -> Boolean
const has_ = (o, k) => k in o;


// API


module.exports = {has, has_};