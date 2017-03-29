"use strict";


/**
 * @name set property destructively
 * @type impure operator function
 * @example
 *

   const o = {x: 1}
   const p = destructiveSet("y") (2); // {x: 1, y: 2}
   o === p // true

 */


// String -> a -> Object -> Object
const destructiveSet = k => v => o => Object.assign(o, {k: v});


// (Object, String, a) -> Object
const destructiveSet_ = (o, k, v) => Object.assign(o, {k: v});


// API


module.exports = {destructiveSet, destructiveSet_};