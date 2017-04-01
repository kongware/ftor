"use strict";


/**
 * @name set a property of a shallow object destructively
 * @type impure operator function
 * @example
 *

   const o = {x: 1}
   const p = destructiveSet("y") (2); // {x: 1, y: 2}
   o === p // true

 */


// String -> a -> Object -> Object
const destructiveSet = k => v => o => (o[k] = v, o);


// (Object, String, a) -> Object
const destructiveSet_ = (o, k, v) => (o[k] = v, o);


// API


module.exports = {destructiveSet, destructiveSet_};