"use strict";


// dependencies


const Pair = require("./Pair");


/**
 * @name maxinmal bounded Pair
 * @type operator function
 * @example
 *

   const _Number = {maxBound: Infinity};
   const _Boolean = {maxBound: true};
   maxBound2(_Number) (_Boolean) (x => _ => x); // Infinity
   maxBound2(_Number) (_Boolean) (_ => y => y); // true

 */


// Bounded a, Bounded b => Object -> Object -> (a -> b -> c)
const maxBound2 = Rep1 => Rep2 => Pair(Rep1.maxBound, Rep2.maxBound);


// Bounded a, Bounded b => (Object, Object) -> (a -> b -> c)
const maxBound2_ = (Rep1, Rep2) => Pair(Rep1.maxBound, Rep2.maxBound);


// API


module.exports = {maxBound2, maxBound2_};