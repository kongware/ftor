"use strict";


/**
 * @name has element
 * @type operator function
 * @example

   const Triple = (x, y, z) => f => f(x, y, z);
   const has = x => (...args) => args.includes(x)
   const triple = Triple(1, "a", true);

   triple(has(2)); // false
   triple(has("a")); // true

 */


// a -> (*) -> Boolean
const has = x => (...args) => args.includes(x)


// API


module.exports = has;