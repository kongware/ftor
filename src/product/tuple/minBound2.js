"use strict";


// dependencies


const Pair = require("./Pair");


/**
 * @name mininmal bounded Pair
 * @type operator function
 * @example
 *

   const _Number = {minBound: -Infinity};
   const _Boolean = {minBound: false};
   minBound2(_Number) (_Boolean) (x => _ => x); // -Infinity
   minBound2(_Number) (_Boolean) (_ => y => y); // false

 */


// Bounded a, Bounded b => Object -> Object -> (a -> b -> c)
const minBound2 = Rep1 => Rep2 => Pair(Rep1.minBound, Rep2.minBound);


// Bounded a, Bounded b => (Object, Object) -> (a -> b -> c)
const minBound2_ = (Rep1, Rep2) => Pair(Rep1.minBound, Rep2.minBound);


// API


module.exports = {minBound2, minBound2_};