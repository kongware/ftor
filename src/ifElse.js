"use strict";


/**
 * @name if else
 * @note lazy conditional expression; catamorphism for Booleans analogous to foldl
 * @type first order function
 * @status stable
 * @example

   const ifElse = x => y => z => z ? x : y;
   const ifElse_ = z => x => y => z ? x : y;

   const eq = x => y => Object.is(x, y);
   const fooBar = ifElse("foo") ("bar");
   const pred = ifElse_(eq(2) (3))
   
   fooBar(eq(2) (2)); // "foo"
   pred("foo") ("bar"); // "bar"

 */


// a -> a -> Boolean -> a
const ifElse = x => y => z => z ? x : y;


// Boolean -> a -> a -> a
const ifElse_ = z => x => y => z ? x : y;


module.exports = {ifElse, ifElse_};