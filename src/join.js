"use strict";


/**
 * @name monadic join
 * @type higher order function
 * @example

   ?

 */


// (r -> r -> a) -> r -> a
const join = f => x => f(x) (x);


// API


module.exports = join;