"use strict";


// dependencies


const Triplet = require("./Triplet");


/**
 * @name mininmal bounded Triplet
 * @type operator function
 * @example
 *

   const _Number = {minBound: -Infinity};
   const _Boolean = {minBound: false};
   const _Char = {minBound: "\u{0}"}
   minBound3(_Number) (_Boolean) (_Char) (x => _ => _ => x); // -Infinity
   minBound3(_Number) (_Boolean) (_Char) (_ => y => _ => y); // false
   minBound3(_Number) (_Boolean) (_Char) (_ => _ => z => z); // "\u{0}"

 */


// Bounded a, Bounded b, Bounded c => Object -> Object -> Object -> (a -> b -> c -> d)
const minBound3 = Rep1 => Rep2 => Rep3 => Pair(Rep1.minBound, Rep2.minBound, Rep3.minBound);


// Bounded a, Bounded b, Bounded c => (Object, Object, Object) -> (a -> b -> c -> d)
const minBound3_ = (Rep1, Rep2, Rep3) => Pair(Rep1.minBound, Rep2.minBound, Rep3.minBound);


// API


module.exports = {minBound3, minBound3_};