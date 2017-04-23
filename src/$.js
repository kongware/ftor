"use strict";


/**
 * @name apply
 * @note lisp style; composable
 * @type higher order function
 * @example

   const $ = (f, ...args) => args.reduce((g, x) => g(x), f);
   const sum3 = x => y => z => x + y + z;

   $(sum, 1, 2, 3); // 6
   $(sum, 1, 2) (3); // 6

 */


// ((*) -> a) -> (*) -> a
const $ = (f, ...args) => args.reduce((g, x) => g(x), f);


module.exports = $;