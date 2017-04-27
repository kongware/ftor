"use strict";


/**
 * @name if else
 * @type first class function
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


// a -> a -> Boolean -> a
const ifElse_ = z => x => y => z ? x : y;


module.exports = {ifElse, ifElse_};