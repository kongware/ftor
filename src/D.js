"use strict";


/**
 * @name special composition (dove et al.)
 * @note bi-composition, composition in the 2nd/3rd argument
 * @type higher order function
 * @status stable
 * @example

  ??

 */


// (c -> d -> e) -> (a -> c) -> a -> (b -> d) -> b -> e
const D = f => g => x => h => y => f(g(x)) (h(y));


// (a -> c -> d) -> a -> (b -> c) -> b -> d
const D2 = f => x => g => y => f(x) (g(y));


// (a -> b -> d -> e) -> a -> b -> (c -> d) -> c -> e
const D3 = f => x => y => g => z => f(x) (y) (g(z));


// API


module.exports = {D, D2, D3};