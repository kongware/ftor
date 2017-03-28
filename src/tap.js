"use strict";


/**
 * @name tap
 * @type impure function
 * @example
 *

   const add = y => x => x + y;
   tap2(console.log) (add) (2) (3); // logs and returns 5

 */


// ?
const tap = f => x => (f(x), x);


// ?
const tap2 = f => x => y => (f(x) (y), y);


// ?
const tap2_ = (f, x) => y => (f(x) (y), y);


// ?
const tap2__ = (f, x) => y => (f(x, y), y);


// ?
const tap3 = f => x => y => z => (f(x) (y) (z), z);


// ?
const tap3_ = (f, x, y) => z => (f(x) (y) (z), z);


// ?
const tap3__ = (f, x, y) => z => (f(x, y, z), z);


// API


module.exports = {tap, tap2, tap2_, tap2__, tap3, tap3_, tap3__};