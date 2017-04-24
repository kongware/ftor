"use strict";


/**
 * @name Bounded
 * @type type representative
 */


const Bounded = {};


/**
 * @name minimal bound
 * @type constant
 * @example

   const lt_ = x => y => x < y;

   const Bounded = {};
   Bounded.minBound = false;

   lt_(Bounded.minBound) (true); // true

 */


// Boolean
Bounded.minBound = false;


/**
 * @name maximal bound
 * @type constant
 * @example

   @see minBound

 */


// Boolean
Bounded.maxBound = true;


// API


module.exports = Bounded;