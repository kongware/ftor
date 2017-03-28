"use strict";


/**
 * @name strict evaluation
 * @type higher order function
 * @example
 *

   const repeat = x => () => [x, repeat(x)];
   strict(repeat) ("ha"); // ["ha", function]

 */


// (a -> () -> b) -> a -> b
const strict = f => x => f(x) ();


// (a -> b -> () -> c) -> a -> b -> c
const strict2 = f => x => y => f(x) (y) ();


// ((a -> b -> () -> c), a) -> b -> c
const strict2_ = (f, x) => y => f(x) (y) ();


// (((a, b) -> () -> c), a) -> b -> c
const strict2__ = (f, x) => y => f(x, y) ();


// (a -> b -> c -> () -> d) -> a -> b -> c -> d
const strict3 = f => x => y => z => f(x) (y) (z) ();


// ((a -> b -> c -> () -> d), a, b) -> c -> d
const strict3_ = (f, x, y) => z => f(x) (y) (z) ();


// (((a, b, c) -> () -> d), a, b) -> c -> d
const strict3__ = (f, x, y) => z => f(x, y, z) ();


// API


module.exports = {strict, strict, strict2, strict2_, strict2__, strict3, strict3_, strict3__};