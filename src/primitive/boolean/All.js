"use strict";


// dependencies


const {and, and_} = require("./and");


/**
 * @name All
 * @type type representative
 * @status stable
 */


const All = {};


// Semigroup


All.concat = and;
All.concat_ = and_;


// Monoid


/**
 * @name empty
 * @type constant
 * @status stable
 * @example

   const foldl = f => acc => xs => xs.reduce((acc, x, i) => f(acc) (x, i), acc);
   const and = x => y => x && y;

   const All = {};
   All.concat = and;
   All.empty = true;

   const fold = foldl(All.concat) (All.empty);

   fold([true, true, true]); // true

 */


// Boolean
All.empty = true;


// API


module.exports = All;