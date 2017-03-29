"use strict";


// dependencies


const Triplet = require("./Triplet");


/**
 * @name maxinmal bounded Triplet
 * @type operator function
 * @example
 *

   const _Number = {maxBound: Infinity};
   const _Boolean = {maxBound: true};
   const _Char = {maxBound: "\u{10FFFF}"}
   maxBound3(_Number) (_Boolean) (_Char) (x => _ => _ => x); // Infinity
   maxBound3(_Number) (_Boolean) (_Char) (_ => y => _ => y); // true
   maxBound3(_Number) (_Boolean) (_Char) (_ => _ => z => z); // "\u{10FFFF}"

 */


// Bounded a, Bounded b, Bounded c => Object -> Object -> Object -> (a -> b -> c -> d)
const maxBound3 = Rep1 => Rep2 => Rep3 => Pair(Rep1.maxBound, Rep2.maxBound, Rep3.maxBound);


// Bounded a, Bounded b, Bounded c => (Object, Object, Object) -> (a -> b -> c -> d)
const maxBound3_ = (Rep1, Rep2, Rep3) => Pair(Rep1.maxBound, Rep2.maxBound, Rep3.maxBound);


// API


module.exports = {maxBound3, maxBound3_};