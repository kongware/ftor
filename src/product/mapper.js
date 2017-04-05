"use strict";


/**
 * @name map transducer
 * @type operator function
 * @example
 *

   ?

 */


// (a -> b) -> (r -> b -> r) -> r -> a -> r
const mapper = tf => rf => acc => x => rf(acc) (tf(x));


// API


module.exports = filterer;