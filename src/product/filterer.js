"use strict";


/**
 * @name filter transducer
 * @type operator function
 * @example
 *

   ?

 */


// (a -> Boolean) -> (r -> a -> r) -> r -> a -> r
const filterer = pred => rf => acc => x => pred(x) ? rf(acc) (x) : acc;


// API


module.exports = filterer;