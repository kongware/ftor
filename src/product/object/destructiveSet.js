"use strict";


/**
 * @name set a property destructivley
 * @type impure operator function
 * @example
 *

   const o = {x: 1}
   const p = destructiveSet("y") (2); // {x: 1, y: 2}
   o === p // true

 */


// String -> a -> Object -> Object
const destructiveSet = k => v => o => (o[k] = v, o);


// API


module.exports = destructiveSet;