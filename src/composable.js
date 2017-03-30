"use strict";


/**
 * @name composable transformator
 * @type higher order function
 * @example
 *

   const foldl = (f, acc, xs) => xs.reduce(f, acc);
   const foldl_ = composable(foldl) ((x, y) => x + y, 0);
   
   foldl_([1, 2, 3]); // 6

 */


// (((*), a) -> b) -> (*) -> a -> b
const composable = f => (...args) => x => f(...args, x);


// ((((*), a) -> b), (*)) -> a -> b
const composable_ = (f, ...args) => x => f(...args, x);


// API


module.exports = {composable, composable_};