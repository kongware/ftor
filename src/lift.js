"use strict";


/**
 * @name applicative lift
 * @type higher order function
 * @example
 *

   ?

 */


// (b -> c -> d) -> (a -> b) -> (a -> c) -> a -> d
const lift = f => g => h => x => f(g(x)) (h(x));


// ((b -> c -> d), (a -> b), (a -> c)) -> a -> d
const lift_ = (f, g, h) => x => f(g(x)) (h(x));


// API


module.exports = {lift, lift_};