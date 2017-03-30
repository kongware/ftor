"use strict";


/**
 * @name filter transducer
 * @type higher order function
 * @example
 *

   ?

 */


// (b -> Boolean) -> (a -> b -> a) -> a -> b -> a
const filterer = pred => rf => acc => x => pred(x) ? rf(acc) (x) : acc;


// ((b -> Boolean), (a -> b -> a), a) -> b -> a
const filterer_ = (pred, rf, acc) => x => pred(x) ? rf(acc) (x) : acc;


// API


module.exports = {filterer, filterer_};