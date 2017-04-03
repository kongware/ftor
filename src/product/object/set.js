"use strict";


/**
 * @name set a property
 * @type operator function
 * @example
 *

   const o = {x: 1}
   const p = set("y") (2); // {x: 1, y: 2}
   o === p // false

 */


// String -> a -> Object -> Object
const set = k => v => o => Object.assign({}, o, {[k]: v});


// (Object, String, a) -> Object
const set_ = (o, k, v) => Object.assign({}, o, {[k]: v});


// API


module.exports = {set, set_};