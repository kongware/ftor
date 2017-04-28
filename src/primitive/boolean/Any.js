"use strict";


// dependencies


const {or, or_} = require("./or");


/**
 * @name Any
 * @type type representative
 * @status stable
 */


const Any = {};


// Semigroup


Any.concat = or;
Any.concat_ = or_;


// Monoid


/**
 * @name empty
 * @type constant
 * @status stable
 * @example

   const foldl = f => acc => xs => xs.reduce((acc, x, i) => f(acc) (x, i), acc);
   const or = x => y => x || y;

   const Any = {};
   Any.concat = or;
   Any.empty = false;

   const fold = foldl(Any.concat) (Any.empty);

   fold([false, true, false]); // true

 */


// Boolean
Any.empty = false;


// API


module.exports = Any;