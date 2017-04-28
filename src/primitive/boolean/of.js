"use strict";


/**
 * @name of
 * @note lambda prevents constructor use of Boolean
 * @type first order function
 * @status unstable
 * @todo reconsider name
 * @example

   const of = x => Boolean(x);
   
   of("foo"); // true
   of(""); // false

 */


// a -> Boolean
const of = x => Boolean(x);


// API


module.exports = of;