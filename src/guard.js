"use strict";


/**
 * @name guarded function
 * @type higher order function
 * @example

   ?

 */


// (a -> b) -> (a -> Boolean) -> a -> b
const guard = f => pred => x => pred(x) ? f(x) : x;


// (a -> b -> c) -> (a -> b -> Boolean) -> a -> b -> c
const guard2 = f => pred => x => y => pred(x) (y) ? f(x) (y) : y;


// (a -> b -> c -> d) -> (a -> b -> c -> Boolean) -> a -> b -> c -> d
const guard3 = f => pred => x => y => z => pred(x) (y) (z) ? f(x) (y) (z) : z;


// API


module.exports = {guard, guard2, guard3};